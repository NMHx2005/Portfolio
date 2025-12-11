import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { siteContent, type BlogPost, type Locale } from "@/content";
import { ComingSoonCard } from "./coming-soon-card";

type Params = {
  slug: string;
};

interface PostWithLocale extends BlogPost {
  locale: Locale;
}

const allPosts: PostWithLocale[] = Object.entries(siteContent).flatMap(
  ([locale, content]) =>
    content.blog.posts.map((post) => ({ ...post, locale: locale as Locale })),
);

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Article not found",
      description: "The requested article could not be located.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = allPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const backLabel = post.locale === "en" ? "Back to home" : "Quay lại trang chủ";
  const comingSoon =
    post.locale === "en"
      ? "This long-form case study is currently in production. Join the newsletter to get notified once it's live."
      : "Bài viết chi tiết đang được hoàn thiện. Đăng ký nhận tin để cập nhật ngay khi xuất bản.";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 py-24 text-foreground sm:px-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>
      <article className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {post.date} · {post.readingTime}
        </p>
        <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        <ComingSoonCard>{comingSoon}</ComingSoonCard>
      </article>
    </main>
  );
}


