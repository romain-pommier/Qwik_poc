import { component$ } from "@builder.io/qwik";
import {
  useLocation,
  type DocumentHead,
  routeLoader$,
} from "@builder.io/qwik-city";
import { type Post } from "~/Model";
import { createServerClient } from "supabase-auth-helpers-qwik";
import { routeAction$, Form } from "@builder.io/qwik-city";
export const createSubConnection = (requestEv) => {
  const supabaseClient = createServerClient(
    requestEv.env.get("PUBLIC_SUPABASE_URL")!,
    requestEv.env.get("PUBLIC_SUPABASE_ANON_KEY")!,
    requestEv,
  );

  return supabaseClient;
};
export const usePost = routeLoader$(async (requestEv) => {
  const supabaseClient = createSubConnection(requestEv);
  const { data } = await supabaseClient
    .from("BlogPost")
    .select()
    .eq("id", requestEv.params.id)
    .single();

  return { data };
});

export const usePostComments = routeLoader$(async (requestEv) => {
  const supabaseClient = createSubConnection(requestEv);
  const { data } = await supabaseClient
    .from("BlogPostComment")
    .select()
    .eq("blogPostId", requestEv.params.id)
    .order("created_at", { ascending: false });

  return { data };
});

export const useAddPostComment = routeAction$(async (data, requestEvent) => {
  const supabaseClient = createSubConnection(requestEvent);
  const { result } = await supabaseClient
    .from("BlogPostComment")
    .insert({ blogPostId: requestEvent.params.id, content: data["Content"] });

  return {
    success: true,
  };
});

export default component$(() => {
  const post = usePost();
  const action = useAddPostComment();

  const postComments = usePostComments();

  return (
    <>
      <div>
        <h1>My post : {post.value.data.title}</h1>
        <p>{post.value.data.body}</p>
      </div>
      <div>
        <h2>Commentaires</h2>
        {postComments.value.data.map(({ content }) => (
          <div>
            <p>{content}</p>
          </div>
        ))}
        <Form action={action}>
          <input name="Content" placeholder="2crit le contenu ICI" />
          <button type="submit">Ajoute un commentaire</button>
        </Form>
      </div>
      <div>
        <h3>Commentaires</h3>

        {/* {postComments.value.} */}
      </div>
      {action.value?.success && (
        // When the action is done successfully, the `action.value` property will contain the return value of the action
        <p>Comment added successfully</p>
      )}
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to my blog post",
  meta: [
    {
      name: "post blog",
      content: "Qwik site description",
    },
  ],
};
