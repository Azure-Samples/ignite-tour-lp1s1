# The Tailwind Traders Frontend

You can build this app super easily with Docker:

```console
docker build -t twt-fe .
```

That will build and minimize all assets for you. Then you can run it with:

```console
docker run --rm -p 8080:8080 twt-fe
```

Then you can go check it out at `http://localhost:8080`.
