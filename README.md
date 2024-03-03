# htmlc-compiler

A "compiler" that makes components in HTML possible. It's like JSX without the
JSX.

> [!caution]
> This is a joke project. I do not recommend this for production.

## Running the Compiler

```sh
$ deno run --allow-read --allow-write compile.js test/index.html
```

Before:

```html
<!-- index.html -->
<component href="Footer.html" author="apacheli" />
```

```html
<!-- Footer.html -->
<footer>
  <p>Created by {author}</p>
</footer>
```

After:

```html
<!-- index.html -->
<footer>
  <p>Created by apacheli</p>
</footer>
```

## License

[License](LICENSE.txt)
