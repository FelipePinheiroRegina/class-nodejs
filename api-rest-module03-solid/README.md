# CREATION FLOW OF THIS SERVER

1. Install initial packages

```javascript
// CLI
npm init -y

// DEPENDENCIES
//  "@fastify/jwt": "9.1.0",
//  "@prisma/client": "5.21.0",
//  "bcryptjs": "2.4.3",
//  "dayjs": "1.11.13",
//  "dotenv": "16.4.5",
//  "fastify": "5.0.0",
//  "zod": "3.23.8"

//DEVDEPENDENCIES
// "@eslint/js": "9.12.0",
// "@types/bcryptjs": "2.4.6",
// "@types/node": "22.7.5",
// "@vitest/coverage-v8": "3.1.1",
// "@vitest/ui": "3.1.1",
// "eslint": "9.12.0",
// "globals": "15.11.0",
// "prisma": "5.21.0",
// "tsup": "8.3.0",
// "tsx": "4.19.1",
// "typescript": "5.6.3",
// "typescript-eslint": "8.9.0",
// "vite-tsconfig-paths": "5.1.4",
// "vitest": "3.1.1"
```

2. Configs eslint, env, npmrc, vite to vitest, prisma, docker

3. Structure folders

```text
src/
    @types/          -> relations configs types
    env/             -> relations starting environments variables 
    http/            -> relations controllers/middlewares/routes
    repositories/    -> relations database methods
    lib/             -> relations configs of externals libs ex.: config prisma/client
    use-case/        -> core of app, use cases and tests unitary
    utils/           -> functions to use anywhere
    app.ts           -> where have instance fastify and plugins
    server.ts        -> where server starts
```

4. Before starting development, have the functional and non-functional requirements and business rules clearly defined.

5. Start developing the server through use cases and unit tests using some patterns
    - In memory repositories
    - TDD -> Red, Green, Refactor
    - D -> Dependency Inversion Principle

6. Before start developing the controllers logic create the Factory Pattern

# AUTHENTICATED METHODS

BASIC AUTH
- send credentials on request header request transformed in base64
- it's not safe

AUTH JWT: JSON WEB TOKEN
1. user log-in with email and password

2. back-end create a unique token, non-modifiable, stateless
    - stateless: There is no data persistence (Data base)

3. How do I know that the token is secure? The backend creates a unique token based on a keyword that is not exposed

4. The JWT is composed of three parts -> header.payload.signature
    - Header (algorithm) - (token type)
    - Payload (credentials user)
    - Signature (base64 header, base64 payload, keyword) - transformed into a hash based on the chosen algorithm

5. The backend is the only one that can encode or decode the signature (token generated based on the keyword), as it is the only one that has the keyword

6. Login -> JWT

7. JWT -> in all requests from then on  
    - Header: Authorization: Bearer JWT
