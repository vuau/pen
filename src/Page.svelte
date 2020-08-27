<script>
  import { onMount } from 'svelte'
  import { gun } from './contexts.js'
  import { getParentNode } from './stores.js'

  export let params = {}

  const pub = params.pub
  const slug = params.slug
  let content = 'loading...'

  onMount(async () => {
    const user = gun.user(pub)
    user
      .get('slugs')
      .get(slug)
      .once(v => {
        let parts = v.split('_') // eslint-disable-line
        const id = parts.pop()
        const path = parts.join('_')
        getParentNode(path, user)
          .get(id)
          .once(v => {
            content = v.content
            console.log(v)
          })
      })
  })
</script>
{@html content}
