import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead, Link } from "@builder.io/qwik-city";
import { type Post } from "~/Model";
import { createServerClient } from "supabase-auth-helpers-qwik";

export const getPosts = routeLoader$(async (requestEv) => {
  const supabaseClient = createServerClient(
    requestEv.env.get("PUBLIC_SUPABASE_URL")!,
    requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
    requestEv,
  );

  const { data } = await supabaseClient.from("BlogPost").select("*");
  console.log("data => ", data);

  return { data };
});

export default component$(() => {
  const posts = getPosts();

  return (
    <>
      <h1>My blog</h1>
      <div style={"display:flex; flex-wrap:wrap"}>
        {posts.value.data.map(({ id, title, body }) => (
          <div style={"width:150px"} key={id}>
            <Link href={`/blog/${id}`}>
              <h3>{title}</h3>
              <p>{body}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to my blog",
  meta: [
    {
      name: "blog",
      content: "Qwik site description",
    },
  ],
};
