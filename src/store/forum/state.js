import {
  testPosts,
  testForums,
  testFullPosts,
} from '@/testData';

export default () => ({
  forumPosts: testPosts,
  // TODO: Turn this into a request. This should NOT be stored locally due to
  // the amount of information stored (full post and comments content).
  forumFullPosts: testFullPosts,
  forums: testForums,
  currentForumViewPathName: '',
  currentlyFocusedPostId: testPosts[0].id, // FIXME: Better way in the end product
});
