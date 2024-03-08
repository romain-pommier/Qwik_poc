import { component$ } from "@builder.io/qwik"
import type { DocumentHead } from "@builder.io/qwik-city"

export default component$(() => {
    return (
        <>
            <h1>My contact</h1>
        </>
    )
})

export const head: DocumentHead = {
    title: "Welcome to my contact",
    meta: [
        {
            name: "contact",
            content: "Qwik site description",
        },
    ],
}
