'use client'

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import Post from "./Post";

interface PostFeedProps {
  initialPosts: ExtendedPost[]
  subredditName?: string
}

/*
In order to do infinite scroll, we track the location of the viewport. When it reaches the bottom post,
a call is made to the API to get the next set of posts. To do this, we need a ref
*/
const PostFeed = ({ initialPosts, subredditName }: PostFeedProps) => {
  const { data: session } = useSession();

  const lastPostRef = useRef<HTMLElement>(null); // need this ref to be passed into useIntersection hook

  const { ref, entry } = useIntersection({ // the ref (what we're assigning post to) and entry (where we check if intersecting)
    root: lastPostRef.current,
    threshold: 1
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      // define endpoint for getting posts
      const query = `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : '');

      const { data } = await axios.get(query)
      return data as ExtendedPost[]
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },
      initialData: { pages: [initialPosts], pageParams: [1] }, /* Is used to append existing posts to the
      data being sent back (that way each call to the query doesn't replace the old posts). see:
      https://tanstack.com/query/v4/docs/react/reference/useInfiniteQuery */
    }
  );

  useEffect(() => { // this useEffect is needed to do the fetching of more posts for infinite scroll
    if (entry?.isIntersecting) {
      fetchNextPage() // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage])

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className='flex flex-col col-span-2 space-y-6'>
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1
          if (vote.type === 'DOWN') return acc - 1
          return acc
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        if (index === posts.length - 1) {
          // Add a ref to the last post in the list. The li ref={ref} is key here
          return (
            <li key={post.id} ref={ref}>
              <Post
                post={post}
                commentAmt={post.comments.length}
                subredditName={post.subreddit.name}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            </li>
          )
        } else {
          return (
            <Post
              key={post.id}
              post={post}
              commentAmt={post.comments.length}
              subredditName={post.subreddit.name}
              votesAmt={votesAmt}
              currentVote={currentVote}
            />
          )
        }
      })}
    </ul>
  );
}

export default PostFeed;