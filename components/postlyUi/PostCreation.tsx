"use client"
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useBlogPostCreationSchema } from "@/hooks/useValidations";
import { useCreateBlogPostMutation } from "@/redux/apis/blogPostApi";
import { callToast } from "@/providers/SonnerProvider";
import useTrigger from "@/hooks/useTrigger";
import { ApiResult } from "@/types/auth";
import CustomSpinner from "../reusableUi/CustomSpinner";
import { PaginationContext } from "@/app/postly/layout";
import { useRouter, useSearchParams } from "next/navigation";

const PostCreation = (): React.ReactElement => {
  const { schema } = useBlogPostCreationSchema();
  const { setSearchQuery, setActiveView } = useContext(PaginationContext)

  // ** Router and search params ** \\
  const router = useRouter();
  const searchParams = useSearchParams();

  const postCreationForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "",
      title: "",
      content: ""
    }
  });

  // ** Helper function to update URL with new page ** \\
  const updatePageInURL = (pageType: 'all-posts' | 'created-posts' | 'liked-posts' | 'archived-posts', page: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove all page params first to avoid conflicts
    params.delete('all-posts-page');
    params.delete('created-posts-page');
    params.delete('liked-posts-page');
    params.delete('archived-posts-page');

    // Set the current page param
    if (pageType === 'all-posts') {
      params.set('all-posts-page', page);
    } else if (pageType === 'created-posts') {
      params.set('created-posts-page', page);
    } else if (pageType === 'liked-posts') {
      params.set('liked-posts-page', page);
    } else if (pageType === 'archived-posts') {
      params.set('archived-posts-page', page)
    }

    // Update URL without page reload
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // ** Rtk query ** \\
  const [createBlogPost, { isLoading, error, isError, isSuccess, data }] = useCreateBlogPostMutation();
  const { mutateTrigger } = useTrigger();

  // ** State to handle extra errors ** \\
  const [errors, setErrors] = useState<{ field: string, message: string }[]>([]);
  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      return await createBlogPost(data);
    } catch (err) {
      console.error(`Error in "onSubmit" function in file "PostCreation.tsx": ${err}`);
      return callToast("error", "An unexpected error occured while trying to create your blog post, please try again shortly");
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (isSuccess && !isError && !error) {
      if (isMounted) {
        setSearchQuery("");
        setActiveView("my-posts");
        // Reset to page 1 for created posts in the URL
        updatePageInURL('created-posts', '1');

        mutateTrigger("postCreationModal", false);
        callToast("success", data.message);
      }
    };

    if (isError && error && "data" in error && !isSuccess) {
      const typedError = (error.data as ApiResult).data as { errors: { field: string; message: string; }[] }

      if (typedError) {
        if (isMounted) {
          setErrors(typedError.errors);
          callToast("error", (error.data as ApiResult).message);
        }
      }

    }

    return () => { isMounted = false }
  }, [isSuccess, isError, error, isLoading, data, callToast])
  return (
    <Form {...postCreationForm}>
      <form onSubmit={postCreationForm.handleSubmit(onSubmit)} className="space-y-6 rounded-sm">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Create New Post
          </h1>
          <p className="text-gray-600">
            Share your thoughts and ideas with the community
          </p>
        </header>

        {/* Extra errors */}
        {errors && errors.length > 0 && (
          <div
            className="h-40 p-4 bg-red-100 rounded-xl text-xs text-red-600 space-y-4 overflow-y-auto element-scrollable-hidden-scrollbar"
          >
            <h4 className="border-b border-destructive py-2">Validation errors</h4>
            {errors.map((error, i) => {
              return <p key={i}>{error.field} - {error.message}</p>
            })}
          </div>
        )}

        {/* Category Field */}
        <FormField
          control={postCreationForm.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-900">
                Category
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="e.g., Technology, Design, Lifestyle"
                  className="h-11"
                />
              </FormControl>
              <FormMessage className="text-xs" />
              <p className="text-xs text-gray-500 mt-1">
                Choose a category that best describes your post (3-30 characters)
              </p>
            </FormItem>
          )}
        />

        {/* Title Field */}
        <FormField
          control={postCreationForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-900">
                Title
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Write a compelling title for your post"
                  className="h-11"
                />
              </FormControl>
              <FormMessage className="text-xs" />
              <p className="text-xs text-gray-500 mt-1">
                Create an engaging title (5-100 characters)
              </p>
            </FormItem>
          )}
        />

        {/* Content Field */}
        <FormField
          control={postCreationForm.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-900">
                Content
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write your blog post content here..."
                  className="min-h-[200px] resize-y"
                />
              </FormControl>
              <FormMessage className="text-xs" />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  Share your insights and knowledge (100-2000 characters)
                </p>
                <span className={`text-xs ${field.value.length < 100 || field.value.length > 2000
                  ? "text-red-500"
                  : "text-gray-500"
                  }`}>
                  {field.value.length}/2000
                </span>
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full h-11 cursor-pointer bg-gray-900 hover:bg-gray-800"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">Publishing... <CustomSpinner /></div>
          ) : "Publish Post"}
        </Button>
      </form>
    </Form>
  );
};

export default PostCreation;