import mongoose from 'mongoose';
import validator from 'validator';

const reportSchema = new mongoose.Schema({
  reportedClerkUserId: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return validator.isAlphanumeric(v, 'en-US');
      },
      message: 'reportedClerkUserId must be alphanumeric'
    }
  },
  reportedBy: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return validator.isAlphanumeric(v, 'en-US');
      },
      message: 'reportedBy must be alphanumeric'
    }
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'spam',
      'harassment',
      'inappropriate_content',
      'fake_account',
      'other'
    ],
    trim: true
  },
  details: {
    type: String,
    trim: true,
    maxlength: 500
  },
  timestamp: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return validator.isISO8601(v.toISOString());
      },
      message: 'timestamp must be a valid ISO8601 date'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  reviewedBy: {
    type: String,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  resolution: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reportSchema.index({ reportedClerkUserId: 1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ reason: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ timestamp: -1 });
reportSchema.index({ createdAt: -1 });

// Virtual for reported user
reportSchema.virtual('reportedUser', {
  ref: 'User',
  localField: 'reportedClerkUserId',
  foreignField: 'clerkUserId',
  justOne: true
});

// Virtual for reporting user
reportSchema.virtual('reportingUser', {
  ref: 'User',
  localField: 'reportedBy',
  foreignField: 'clerkUserId',
  justOne: true
});

// Static methods
reportSchema.statics.createReport = async function(reportData) {
  // Validate required fields
  const requiredFields = ['reportedClerkUserId', 'reportedBy', 'reason', 'timestamp'];
  const missingFields = requiredFields.filter(field => !reportData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate timestamp
  if (!validator.isISO8601(reportData.timestamp)) {
    throw new Error('Invalid timestamp format. Must be ISO8601');
  }

  // Create new report
  const report = new this(reportData);
  await report.save();

  return {
    success: true,
    message: 'Report created successfully',
    report: {
      id: report._id,
      reportedClerkUserId: report.reportedClerkUserId,
      reportedBy: report.reportedBy,
      reason: report.reason,
      details: report.details,
      timestamp: report.timestamp,
      status: report.status,
      createdAt: report.createdAt
    }
  };
};

// Model
const Report = mongoose.models.Report || mongoose.model('Report', reportSchema, 'reports');

export default Report;
