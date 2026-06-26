"use client";

import { useMemo, useState } from "react";
import { loadBlogs, saveBlogs, type BlogPost } from "@/lib/jiv-storage";
import { PencilLine, BookOpen, Tag, Package } from "lucide-react";

const sampleRecipes: BlogPost[] = [
  {
    id: "sample-rec-1",
    category: "Recipes",
    bloggerName: "Rajnandini Kanade",
    title: "Dog-Safe Birthday Cakes: A Healthy Way to Celebrate",
    content:
      "Pets are an important part of our family, and celebrating their special days with safe and healthy food is essential. Dog-safe cakes are prepared using natural ingredients such as oats, peanut butter, pumpkin, and yogurt without sugar or chocolate. These cakes provide nutrition while keeping pets safe from harmful ingredients. Homemade treats also help in maintaining better digestion and energy levels in dogs.",
    createdAtISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: "Published",
  },
  {
    id: "sample-rec-2",
    category: "Recipes",
    bloggerName: "Ketaki Mahamuni",
    title: "Nutrition Tips for a Healthy and Active Dog",
    content:
      "Proper nutrition plays a vital role in a dog’s overall health. A balanced diet consisting of proteins, carbohydrates, vitamins, and minerals helps maintain strong immunity and healthy growth. Avoid processed foods and include natural ingredients such as vegetables, rice, and lean meat. Clean drinking water and portion control are equally important for long-term pet health.",
    createdAtISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "Published",
  },
];

const samplePetCare: BlogPost[] = [
  {
    id: "sample-care-1",
    category: "Pet Care",
    bloggerName: "Rajnandini Kanade",
    title: "Seasonal Care Tips for Dogs",
    content:
      "Seasonal changes can affect pets significantly. During summer, pets need adequate hydration and protection from heat strokes. In winter, warm shelter and proper nutrition are essential. Regular grooming and health checkups help prevent seasonal illnesses and improve overall well-being.",
    createdAtISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: "Published",
  },
  {
    id: "sample-care-2",
    category: "Pet Care",
    bloggerName: "Ketaki Mahamuni",
    title: "Importance of Daily Exercise for Pets",
    content:
      "Regular exercise keeps pets physically active and mentally healthy. Daily walks, playtime, and light training help reduce stress and prevent obesity. Exercise also improves digestion, strengthens muscles, and enhances a pet’s overall behavior.",
    createdAtISO: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "Published",
  },
];

export default function PetCarePage() {
  const [recipes, setRecipes] = useState<BlogPost[]>(() => {
    const r = loadBlogs("Recipes");
    return r.length ? r : sampleRecipes;
  });
  const [petCare, setPetCare] = useState<BlogPost[]>(() => {
    const c = loadBlogs("Pet Care");
    return c.length ? c : samplePetCare;
  });

  const [bloggerName, setBloggerName] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [category, setCategory] = useState<"Recipes" | "Pet Care">("Recipes");
  const [content, setContent] = useState("");
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);
  const showPendingOnly = false;

  const publishedRecipes = useMemo(
    () => recipes.filter((p) => p.status === "Published"),
    [recipes]
  );
  const pendingRecipes = useMemo(
    () => recipes.filter((p) => p.status === "Pending"),
    [recipes]
  );

  const publishedCare = useMemo(
    () => petCare.filter((p) => p.status === "Published"),
    [petCare]
  );
  const pendingCare = useMemo(
    () => petCare.filter((p) => p.status === "Pending"),
    [petCare]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMsg(null);
    if (!bloggerName.trim() || !blogTitle.trim() || !content.trim()) {
      setSubmitMsg("Please fill all fields.");
      return;
    }

    const newPost: BlogPost = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `post-${Date.now()}`,
      category,
      bloggerName: bloggerName.trim(),
      title: blogTitle.trim(),
      content: content.trim(),
      createdAtISO: new Date().toISOString(),
      status: "Pending",
    };

    if (category === "Recipes") {
      const updated = [...recipes, newPost];
      setRecipes(updated);
      saveBlogs("Recipes", updated);
    } else {
      const updated = [...petCare, newPost];
      setPetCare(updated);
      saveBlogs("Pet Care", updated);
    }

    setBloggerName("");
    setBlogTitle("");
    setContent("");
    setSubmitMsg("Submitted blog will be reviewed before publishing.");
  }

  const products = [
    "Collars",
    "Pet Food",
    "Safety Gear",
    "Accessories",
  ] as const;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pet Care & Nutrition</h1>
        <p className="mt-2 text-sm text-slate-600">
          Informative blogs and guidance to help pet owners care for their pets better.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-sky-700" />
            <h2 className="text-lg font-bold text-slate-900">Gourmet Pet Recipes</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Healthy and safe food ideas specially prepared for pets, focusing on nutrition and well-being.
          </p>

          <div className="mt-4 space-y-4">
            {(showPendingOnly ? pendingRecipes : publishedRecipes).map((p) => (
              <article key={p.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                  <div className="text-xs text-slate-500">
                    {p.status === "Pending" ? "Pending review" : `By ${p.bloggerName}`}
                  </div>
                </div>
                <div className="mt-3 text-xs leading-6 text-slate-700 whitespace-pre-wrap">
                  {p.content}
                </div>
              </article>
            ))}
            {(!publishedRecipes.length && !pendingRecipes.length) ? (
              <div className="text-xs text-slate-600">No posts available.</div>
            ) : null}
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-emerald-700" />
            <h2 className="text-lg font-bold text-slate-900">Pet Care Blogs</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Guidelines and tips to maintain pet health, hygiene, and daily activity.
          </p>

          <div className="mt-4 space-y-4">
            {(showPendingOnly ? pendingCare : publishedCare).map((p) => (
              <article key={p.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                <div className="mt-2 text-xs text-slate-500">
                  {p.status === "Pending" ? "Pending review" : `By ${p.bloggerName}`}
                </div>
                <div className="mt-3 text-xs leading-6 text-slate-700 whitespace-pre-wrap">
                  {p.content}
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <PencilLine className="h-5 w-5 text-sky-700" />
            <h2 className="text-lg font-bold text-slate-900">Blog Submission Area</h2>
          </div>
          <div className="text-xs text-slate-600">
            Submitted blogs will be reviewed before publishing.
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">Blogger Name</div>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
              value={bloggerName}
              onChange={(e) => setBloggerName(e.target.value)}
              placeholder="Your name"
              required
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">Blog Title</div>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-300"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Title"
              required
            />
          </label>

          <label className="space-y-1">
            <div className="text-xs font-medium text-slate-700">
              Category Selection
            </div>
            <select
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-300"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "Recipes" | "Pet Care")
              }
            >
              <option value="Recipes">Recipes</option>
              <option value="Pet Care">Pet Care</option>
            </select>
          </label>

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
            No products are sold directly here. Blogs are for education and awareness only.
          </div>

          <label className="space-y-1 lg:col-span-2">
            <div className="text-xs font-medium text-slate-700">Blog Content</div>
            <textarea
              className="min-h-[140px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-300"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              required
            />
          </label>

          <div className="flex items-center gap-3 lg:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
            >
              Submit
            </button>
            {submitMsg ? (
              <div className="text-xs text-slate-600">{submitMsg}</div>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-emerald-700" />
          <h2 className="text-lg font-bold text-slate-900">Pet Products</h2>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Recommended pet care products for safety and comfort (display only, awareness purposes).
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-900">{p}</div>
              <div className="mt-2 text-xs leading-5 text-slate-600">
                Informational category only (no purchase functionality).
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

