export const syncLikesWithWishlist = () => {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const likes = JSON.parse(localStorage.getItem('likedBooks') || '[]');
  
  // Sync wishlist with likes
  wishlist.forEach((book: any) => {
    if (!likes.includes(book.id)) {
      likes.push(book.id);
    }
  });
  
  localStorage.setItem('likedBooks', JSON.stringify(likes));
  return likes;
};

export const updateBookLikeCount = (bookId: number, increment: boolean) => {
  const likes = JSON.parse(localStorage.getItem('bookLikes') || '{}');
  if (!likes[bookId]) {
    likes[bookId] = 0;
  }
  likes[bookId] += increment ? 1 : -1;
  if (likes[bookId] < 0) likes[bookId] = 0;
  localStorage.setItem('bookLikes', JSON.stringify(likes));
  return likes[bookId];
};

export const getBookLikeCount = (bookId: number) => {
  const likes = JSON.parse(localStorage.getItem('bookLikes') || '{}');
  return likes[bookId] || 0;
};