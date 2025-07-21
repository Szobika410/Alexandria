import mongoose from "mongoose";
import validator from 'validator';

const userSchema = new mongoose.Schema({
  is2FAEnabled: {
    type: Boolean,
    default: false
  },
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9-_]+$/.test(v);
      },
      message: props => `${props.value} is not a valid Clerk user ID!`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return validator.isEmail(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9._-]{3,30}$/.test(v);
      },
      message: props => `${props.value} must be 3-30 characters and contain only lowercase letters, numbers, dots, underscores and hyphens!`
    }
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: 50,
    validate: {
      validator: function(v) {
        return /^[\p{L}\p{M}\s-]+$/u.test(v);
      },
      message: props => `${props.value} contains invalid characters!`
    }
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50,
    validate: {
      validator: function(v) {
        return /^[\p{L}\p{M}\s-]+$/u.test(v);
      },
      message: props => `${props.value} contains invalid characters!`
    }
  },
  image: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return validator.isURL(v, { protocols: ['http', 'https'], require_tld: true });
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  preferences: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active'
  },
  roles: [{
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  }],
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lastFailedLogin: {
    type: Date
  },
  lockUntil: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add compound indexes for frequently used queries
userSchema.index({ clerkUserId: 1, email: 1 });
userSchema.index({ username: 1, status: 1 });
userSchema.index({ email: 1, status: 1 });
userSchema.index({ roles: 1 });

// Add virtuals for derived data
userSchema.virtual('fullName').get(function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

userSchema.virtual('isLocked').get(function() {
  return this.lockUntil && this.lockUntil > new Date();
});

// Add pre-save middleware for updating timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add static methods for common operations
userSchema.statics.validateUsername = async function(username) {
  const user = await this.findOne({ username });
  if (user) {
    throw new Error('Username already exists');
  }
  return true;
};

userSchema.statics.syncUser = async function(userData) {
  const { clerkUserId, email, username, firstName, lastName, image } = userData;

  // Validate required fields
  if (!clerkUserId || !email || !username) {
    throw new Error('Missing required fields: clerkUserId, email, username');
  }

  // Validate data
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }

  if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
    throw new Error('Username must be 3-30 characters and contain only lowercase letters, numbers, dots, underscores and hyphens');
  }

  // Check for duplicates
  const existingUser = await this.findOne({
    $or: [
      { clerkUserId },
      { email },
      { username }
    ]
  });

  if (existingUser && existingUser.clerkUserId !== clerkUserId) {
    throw new Error(`Duplicate user found with email: ${email}`);
  }

  // Update or create user
  const user = await this.findOneAndUpdate(
    { clerkUserId },
    {
      email,
      username,
      firstName,
      lastName,
      image,
      lastLogin: Date.now(),
      updatedAt: Date.now(),
      status: 'active',
      failedLoginAttempts: 0,
      lockUntil: null
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return user;
};

// Role management constants
const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// Role hierarchy
const ROLE_HIERARCHY = {
  [ROLES.USER]: 1,
  [ROLES.MODERATOR]: 2,
  [ROLES.ADMIN]: 3
};

// Role permissions
const ROLE_PERMISSIONS = {
  [ROLES.USER]: ['read', 'write'],
  [ROLES.MODERATOR]: ['read', 'write', 'moderate'],
  [ROLES.ADMIN]: ['read', 'write', 'moderate', 'admin']
};

// Role validation
const validateRoles = (roles) => {
  const validRoles = Object.values(ROLES);
  const invalidRoles = roles.filter(role => !validRoles.includes(role));
  
  if (invalidRoles.length > 0) {
    throw new Error(`Invalid roles: ${invalidRoles.join(', ')}. Valid roles are: ${Object.values(ROLES).join(', ')}`);
  }
};

// Role management methods
userSchema.statics.updateUserRoles = async function(userData, requestingUser) {
  const { clerkUserId, username, roles } = userData;

  // Validate required fields
  if (!clerkUserId || !username || !roles) {
    throw new Error('Missing required fields: clerkUserId, username, roles');
  }

  // Validate roles
  validateRoles(roles);

  // Check if user exists
  const existingUser = await this.findOne({
    $or: [
      { clerkUserId },
      { username }
    ]
  });

  if (!existingUser) {
    throw new Error(`User not found with clerkUserId: ${clerkUserId} or username: ${username}`);
  }

  // Check if requesting user has permission to modify roles
  if (requestingUser) {
    const requestingUserRole = requestingUser.roles[0];
    const targetUserRole = existingUser.roles[0];
    
    if (ROLE_HIERARCHY[requestingUserRole] <= ROLE_HIERARCHY[targetUserRole]) {
      throw new Error('Insufficient permissions to modify user roles');
    }
  }

  // Update user roles
  const updatedUser = await this.findOneAndUpdate(
    { clerkUserId },
    {
      roles,
      updatedAt: Date.now()
    },
    { new: true, runValidators: true }
  );

  // Update permissions based on new roles
  updatedUser.permissions = roles.reduce((acc, role) => {
    return [...acc, ...ROLE_PERMISSIONS[role]];
  }, []).filter((value, index, self) => self.indexOf(value) === index);

  await updatedUser.save();

  return updatedUser;
};

// Image validation constants
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Image validation utilities
const validateImage = async (url) => {
  try {
    // Validate URL format
    if (!validator.isURL(url)) {
      throw new Error('Invalid image URL format');
    }

    // Fetch image metadata
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'Accept': 'image/jpeg,image/png,image/webp'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch image metadata');
    }

    // Validate content type
    const contentType = response.headers.get('content-type');
    if (!IMAGE_TYPES.includes(contentType)) {
      throw new Error('Invalid image format. Only JPEG, PNG and WebP are supported');
    }

    // Validate content length
    const contentLength = parseInt(response.headers.get('content-length') || '0');
    if (contentLength > MAX_IMAGE_SIZE) {
      throw new Error(`Image size exceeds maximum allowed size (${MAX_IMAGE_SIZE / 1024 / 1024}MB)`);
    }

    return true;
  } catch (error) {
    throw error;
  }
};

// Add profile image update method
userSchema.statics.updateProfileImage = async function(userData) {
  const { clerkUserId, username, image } = userData;

  // Validate required fields
  if (!clerkUserId || !username || !image) {
    throw new Error('Missing required fields: clerkUserId, username, image');
  }

  // Validate image URL
  await validateImage(image);

  // Check if user exists
  const existingUser = await this.findOne({
    $or: [
      { clerkUserId },
      { username }
    ]
  });

  if (!existingUser) {
    throw new Error(`User not found with clerkUserId: ${clerkUserId} or username: ${username}`);
  }

  // Check if image changed
  if (existingUser.image === image) {
    throw new Error('Image URL is the same as the current profile image');
  }

  // Update user image
  const updatedUser = await this.findOneAndUpdate(
    { clerkUserId },
    {
      image,
      updatedAt: Date.now(),
      imageUpdated: Date.now()
    },
    { new: true, runValidators: true }
  );

  // Add image metadata
  updatedUser.imageMetadata = {
    lastUpdated: updatedUser.imageUpdated,
    type: updatedUser.image.split(';').pop().split(',')[0].split(':')[1]
  };

  await updatedUser.save();

  return updatedUser;
};

// Add virtual for permissions
userSchema.virtual('permissions', {
  get: function() {
    return this.roles.reduce((acc, role) => {
      return [...acc, ...ROLE_PERMISSIONS[role]];
    }, []).filter((value, index, self) => self.indexOf(value) === index);
  }
});

// Schemas
const activitySchema = {
  lastActivity: {
    timestamp: { type: Date, default: Date.now },
    ip: { type: String },
    device: { type: String },
    os: { type: String }
  },
  activityHistory: [{
    timestamp: { type: Date, required: true },
    ip: { type: String },
    device: { type: String },
    os: { type: String }
  }]
};

const passwordResetSchema = {
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  resetAttempts: { type: Number, default: 0 },
  lastResetRequest: { type: Date }
};

const preferencesSchema = {
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  language: { type: String, enum: ['hu', 'en'], default: 'hu' },
  emailNotifications: { type: Boolean, default: true },
  dateFormat: { type: String, default: 'YYYY-MM-DD' },
  timeFormat: { type: String, enum: ['12h', '24h'], default: '24h' },
  timezone: { type: String, default: 'Europe/Budapest' },
  showActivity: { type: Boolean, default: true },
  showOnlineStatus: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: Date.now }
};

// Add schemas to user schema
userSchema.add(activitySchema);
userSchema.add(passwordResetSchema);
userSchema.add({
  preferences: {
    type: preferencesSchema,
    default: () => ({
      theme: 'system',
      language: 'hu',
      emailNotifications: true,
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h',
      timezone: 'Europe/Budapest',
      showActivity: true,
      showOnlineStatus: true,
      lastUpdated: Date.now()
    })
  }
});

// Methods
userSchema.statics.logUserActivity = async function(userData) {
  const { clerkUserId, username, timestamp, ip, device, os } = userData;

  // Validate required fields
  if (!clerkUserId || !username || !timestamp) {
    throw new Error('Missing required fields: clerkUserId, username, timestamp');
  }

  // Validate timestamp
  if (!validator.isISO8601(timestamp)) {
    throw new Error('Invalid timestamp format. Must be ISO8601');
  }

  // Check if user exists
  const user = await this.findOne({
    $or: [
      { clerkUserId },
      { username }
    ]
  });

  if (!user) {
    throw new Error(`User not found with clerkUserId: ${clerkUserId} or username: ${username}`);
  }

  // Update last activity
  user.lastActivity = {
    timestamp: new Date(timestamp),
    ip,
    device,
    os
  };

  // Add to activity history
  user.activityHistory.push({
    timestamp: new Date(timestamp),
    ip,
    device,
    os
  });

  // Keep only last 100 activities
  if (user.activityHistory.length > 100) {
    user.activityHistory = user.activityHistory.slice(-100);
  }

  // Update last login time
  user.lastLogin = new Date(timestamp);

  // Save changes
  await user.save();

  return {
    success: true,
    message: 'User activity logged successfully',
    activity: {
      lastActivity: user.lastActivity,
      activityHistory: user.activityHistory,
      lastLogin: user.lastLogin
    }
  };
};

userSchema.statics.generateResetToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

userSchema.statics.generateResetRequest = async function(email) {
  // Validate email
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Find user by email
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Generate reset token
  const resetToken = this.generateResetToken();
  const resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Update user with reset token
  user.resetToken = resetToken;
  user.resetTokenExpires = resetTokenExpires;
  user.resetAttempts = 0;
  user.lastResetRequest = new Date();

  await user.save();

  return {
    success: true,
    message: 'Password reset token generated successfully',
    token: resetToken,
    expires: resetTokenExpires
  };
};

userSchema.statics.validateResetToken = async function(token) {
  const user = await this.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() }
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  return user;
};

userSchema.statics.updatePreferences = async function(userData) {
  const { clerkUserId, username, preferences } = userData;

  // Validate required fields
  if (!clerkUserId || !username || !preferences) {
    throw new Error('Missing required fields: clerkUserId, username, preferences');
  }

  // Check if user exists
  const user = await this.findOne({
    $or: [
      { clerkUserId },
      { username }
    ]
  });

  if (!user) {
    throw new Error(`User not found with clerkUserId: ${clerkUserId} or username: ${username}`);
  }

  // Update preferences
  user.preferences = {
    ...user.preferences,
    ...preferences,
    lastUpdated: Date.now()
  };

  // Validate preferences
  const validPreferences = Object.keys(preferencesSchema);
  const invalidPreferences = Object.keys(preferences).filter(key => !validPreferences.includes(key));
  
  if (invalidPreferences.length > 0) {
    throw new Error(`Invalid preferences: ${invalidPreferences.join(', ')}. Valid preferences are: ${validPreferences.join(', ')}`);
  }

  // Save changes
  await user.save();

  return {
    success: true,
    message: 'Preferences updated successfully',
    preferences: user.preferences
  };
};

userSchema.statics.searchUsers = async function(query) {
  const { role, search } = query || {};

  let filter = {};
  
  if (role) {
    filter.roles = role;
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [
      { email: searchRegex },
      { username: searchRegex },
      { firstName: searchRegex },
      { lastName: searchRegex }
    ];
  }

  return this.find(filter)
    .where('deletedAt').equals(null)
    .select('-password -passwordReset.resetToken -passwordReset.resetTokenExpires -passwordReset.resetAttempts -passwordReset.lastResetRequest');
};

userSchema.statics.bulkSync = async function(users) {
  const bulkOps = users.map(user => ({
    updateOne: {
      filter: { clerkUserId: user.clerkUserId },
      update: {
        $set: {
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          lastLogin: Date.now(),
          updatedAt: Date.now(),
          status: 'active',
          failedLoginAttempts: 0,
          lockUntil: null
        }
      },
      upsert: true,
      setDefaultsOnInsert: true
    }
  }));

  return this.bulkWrite(bulkOps);
};

// Add method to check if user has permission
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

// Add method to check if user has role
userSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

// Add method to get user's role level
userSchema.methods.getRoleLevel = function() {
  return ROLE_HIERARCHY[this.roles[0]] || 1;
};

userSchema.statics.bulkSync = async function(users) {
  const bulk = this.collection.initializeUnorderedBulkOp();
  
  users.forEach(user => {
    bulk.find({ clerkUserId: user.clerkUserId })
      .upsert()
      .updateOne({
        $set: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          updatedAt: Date.now()
        }
      });
  });
  
  return bulk.execute();
};

export default mongoose.models.User || mongoose.model("User", userSchema);
