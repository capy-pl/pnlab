## Start Server

1. Init database

```
grunt initdb
```

2. For front-end, use following command.

```
npm run fdev
```

3. For back-end.

```
npm run dev
```

## Front-End Commands

1. Start a server. Hot module reload is enabled by default.

```
npm run fdev
```

1. Build front-end files.

```
grunt build:client
```

3. Watch front-end files.

```
grunt watch:client
```

4. Start storybook

```
// config your stories in client/ts/stories
npm run storybook
```

## Back-End Commands

1. Use nodemon to listen backend files change.

```
npm run dev
```

2. Build back-end files(convert ts files to js and bundle as a single file).

```
grunt build:server
```

## Unit Test

1. Back-end

```
grunt test:server
```

2. Front-end

```
grunt test:client
```

3. All

```
grunt test
```
