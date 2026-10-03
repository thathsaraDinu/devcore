import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type TopicNode = {
  id: string;
  name: string;
  slug: string;
  description: string;
  children?: TopicNode[];
};

function leaf(
  id: string,
  name: string,
  description?: string,
): TopicNode {
  return {
    id,
    name,
    slug: id,
    description:
      description ?? `Understanding ${name.toLowerCase()}.`,
  };
}

function category(
  id: string,
  name: string,
  description: string,
  children: TopicNode[],
): TopicNode {
  return {
    id,
    name,
    slug: id,
    description,
    children,
  };
}

const topicTree: TopicNode[] = [
  {
    id: "javascript",
    name: "JavaScript",
    slug: "javascript",
    description: "Core language and runtime concepts.",
    children: [
      category(
        "javascript-core",
        "Core Language",
        "The fundamental language features used in JavaScript programs.",
        [
          leaf(
            "javascript-variables",
            "Variables & Constants",
            "Declaring, assigning, and updating values with let, const, and var.",
          ),
          leaf(
            "javascript-types",
            "Primitive Types",
            "JavaScript's primitive value types and their behavior.",
          ),
          leaf(
            "javascript-type-coercion",
            "Type Coercion",
            "How JavaScript converts values between types.",
          ),
          leaf(
            "javascript-equality",
            "Equality",
            "Comparing values with strict and loose equality.",
          ),
          leaf(
            "javascript-operators",
            "Operators",
            "Arithmetic, logical, comparison, assignment, and other operators.",
          ),
          leaf(
            "javascript-control-flow",
            "Control Flow",
            "Conditional and branching logic in JavaScript.",
          ),
          leaf(
            "javascript-loops",
            "Loops",
            "Repeating logic with for, while, and related constructs.",
          ),
          leaf(
            "javascript-functions",
            "Functions",
            "Creating, passing, and executing functions.",
          ),
          leaf(
            "javascript-function-expressions",
            "Function Expressions",
            "Creating functions as values that can be stored or passed around.",
          ),
          leaf(
            "javascript-arrow-functions",
            "Arrow Functions",
            "Concise function syntax and lexical this behavior.",
          ),
          leaf(
            "javascript-parameters",
            "Parameters & Arguments",
            "How functions receive values and define inputs.",
          ),
          leaf(
            "javascript-return-values",
            "Return Values",
            "How functions produce and pass values back to callers.",
          ),
          leaf(
            "javascript-objects",
            "Objects",
            "Working with key-value structures and object behavior.",
          ),
          leaf(
            "javascript-arrays",
            "Arrays",
            "Ordered collections and array operations.",
          ),
          leaf(
            "javascript-destructuring",
            "Destructuring",
            "Extracting values from objects and arrays.",
          ),
        ],
      ),
      category(
        "javascript-scope",
        "Scope",
        "How JavaScript determines which variables are accessible.",
        [
          leaf(
            "javascript-lexical-scope",
            "Lexical Scope",
            "How variable visibility is determined by source code structure.",
          ),
          leaf(
            "javascript-block-scope",
            "Block Scope",
            "Variable visibility inside blocks created by let and const.",
          ),
          leaf(
            "javascript-closures",
            "Closures",
            "Functions retaining access to their lexical environment.",
          ),
          leaf(
            "javascript-scope-chain",
            "Scope Chain",
            "How JavaScript searches enclosing scopes for variables.",
          ),
        ],
      ),
      category(
        "javascript-async",
        "Asynchronous JavaScript",
        "Promises, async operations, and concurrency in JavaScript.",
        [
          leaf(
            "javascript-callbacks",
            "Callbacks",
            "Passing functions to be executed later.",
          ),
          leaf(
            "javascript-higher-order-functions",
            "Higher-Order Functions",
            "Functions that accept or return other functions.",
          ),
          leaf(
            "javascript-promises",
            "Promises",
            "Representing the eventual result of an asynchronous operation.",
          ),
          leaf(
            "javascript-promise-chaining",
            "Promise Chaining",
            "Composing asynchronous operations with then and catch.",
          ),
          leaf(
            "javascript-async-await",
            "async/await",
            "Writing asynchronous control flow using async functions.",
          ),
          leaf(
            "javascript-event-loop",
            "Event Loop",
            "How JavaScript coordinates synchronous and asynchronous work.",
          ),
          leaf(
            "javascript-microtasks",
            "Microtasks & Macrotasks",
            "How different asynchronous queues are scheduled.",
          ),
          leaf(
            "javascript-timers",
            "Timers",
            "Scheduling work with setTimeout and related APIs.",
          ),
          leaf(
            "javascript-concurrency",
            "Concurrency",
            "Managing multiple asynchronous operations without blocking execution.",
          ),
          leaf(
            "javascript-web-workers",
            "Web Workers",
            "Running JavaScript work away from the main browser thread.",
          ),
        ],
      ),
      category(
        "javascript-runtime",
        "Runtime",
        "Concepts explaining how JavaScript executes under the hood.",
        [
          leaf(
            "javascript-execution-context",
            "Execution Context",
            "The environment created when JavaScript starts executing code.",
          ),
          leaf(
            "javascript-call-stack",
            "Call Stack",
            "The stack structure used to track active function calls.",
          ),
          leaf(
            "javascript-heap",
            "Heap",
            "Memory used for dynamically allocated JavaScript objects.",
          ),
          leaf(
            "javascript-garbage-collection",
            "Garbage Collection",
            "How unused JavaScript memory is automatically reclaimed.",
          ),
          leaf(
            "javascript-this",
            "this",
            "How JavaScript determines the value of this during execution.",
          ),
          leaf(
            "javascript-prototypes",
            "Prototypes",
            "JavaScript's prototype-based object inheritance model.",
          ),
          leaf(
            "javascript-classes",
            "Classes",
            "Class syntax built on top of JavaScript's prototype system.",
          ),
          leaf(
            "javascript-es-modules",
            "ES Modules",
            "Using import and export to organize JavaScript modules.",
          ),
          leaf(
            "javascript-commonjs",
            "CommonJS",
            "The module system traditionally used by Node.js.",
          ),
        ],
      ),
    ],
  },

  {
    id: "typescript",
    name: "TypeScript",
    slug: "typescript",
    description: "Static typing for JavaScript applications.",
    children: [
      category(
        "typescript-types",
        "Types",
        "Describing the shape and behavior of values in TypeScript.",
        [
          leaf(
            "typescript-primitive-types",
            "Primitive Types",
            "TypeScript's basic string, number, boolean, bigint, symbol, and other primitives.",
          ),
          leaf(
            "typescript-literal-types",
            "Literal Types",
            "Types representing specific literal values.",
          ),
          leaf(
            "typescript-union-types",
            "Union Types",
            "Allowing a value to be one of several possible types.",
          ),
          leaf(
            "typescript-intersection-types",
            "Intersection Types",
            "Combining multiple type requirements into one type.",
          ),
          leaf(
            "typescript-any",
            "any",
            "Opting out of most TypeScript type checking.",
          ),
          leaf(
            "typescript-unknown",
            "unknown",
            "A type-safe representation of values whose type is not yet known.",
          ),
          leaf(
            "typescript-never",
            "never",
            "Representing impossible values and functions that never return.",
          ),
          leaf(
            "typescript-type-aliases",
            "Type Aliases",
            "Giving reusable names to TypeScript types.",
          ),
          leaf(
            "typescript-interfaces",
            "Interfaces",
            "Describing object shapes and contracts.",
          ),
          leaf(
            "typescript-structural-typing",
            "Structural Typing",
            "Type compatibility based on structure rather than explicit inheritance.",
          ),
        ],
      ),
      category(
        "typescript-generics",
        "Generics",
        "Writing reusable code while preserving precise type information.",
        [
          leaf(
            "typescript-generic-functions",
            "Generic Functions",
            "Functions whose types adapt to the values they receive.",
          ),
          leaf(
            "typescript-generic-constraints",
            "Generic Constraints",
            "Restricting generic types to valid shapes.",
          ),
          leaf(
            "typescript-generic-interfaces",
            "Generic Interfaces",
            "Reusable interfaces parameterized by types.",
          ),
          leaf(
            "typescript-conditional-types",
            "Conditional Types",
            "Choosing types based on other type relationships.",
          ),
          leaf(
            "typescript-mapped-types",
            "Mapped Types",
            "Creating new types by transforming existing properties.",
          ),
          leaf(
            "typescript-utility-types",
            "Utility Types",
            "Built-in helpers such as Partial, Pick, Omit, and Record.",
          ),
        ],
      ),
      category(
        "typescript-narrowing",
        "Narrowing & Inference",
        "Making TypeScript understand more precise types as code executes.",
        [
          leaf(
            "typescript-narrowing",
            "Type Narrowing",
            "Refining broad types into more specific types.",
          ),
          leaf(
            "typescript-type-guards",
            "Type Guards",
            "Runtime checks that provide stronger compile-time type information.",
          ),
          leaf(
            "typescript-discriminated-unions",
            "Discriminated Unions",
            "Using a shared discriminant to safely model multiple variants.",
          ),
          leaf(
            "typescript-type-inference",
            "Type Inference",
            "How TypeScript determines types without explicit annotations.",
          ),
          leaf(
            "typescript-control-flow-analysis",
            "Control Flow Analysis",
            "Tracking possible types through branches and code paths.",
          ),
        ],
      ),
      category(
        "typescript-functions-modules",
        "Functions & Modules",
        "Typing functions and organizing TypeScript applications.",
        [
          leaf(
            "typescript-function-types",
            "Function Types",
            "Describing callable values and their parameters.",
          ),
          leaf(
            "typescript-function-overloads",
            "Function Overloads",
            "Providing multiple call signatures for a function.",
          ),
          leaf(
            "typescript-modules",
            "Modules",
            "Organizing code into imports and exports.",
          ),
          leaf(
            "typescript-declaration-files",
            "Declaration Files",
            "Providing type information for JavaScript modules.",
          ),
          leaf(
            "typescript-module-resolution",
            "Module Resolution",
            "How TypeScript finds imported modules and their types.",
          ),
        ],
      ),
    ],
  },

  {
    id: "react",
    name: "React",
    slug: "react",
    description: "Building interfaces with components and state.",
    children: [
      category(
        "react-fundamentals",
        "Fundamentals",
        "The core concepts behind React applications.",
        [
          leaf(
            "react-components",
            "Components",
            "Reusable units of UI and behavior in React.",
          ),
          leaf(
            "react-jsx",
            "JSX",
            "Writing UI structures using JavaScript syntax.",
          ),
          leaf(
            "react-props",
            "Props",
            "Passing data from one component to another.",
          ),
          leaf(
            "react-state",
            "State",
            "Data a component preserves between renders.",
          ),
          leaf(
            "react-rendering",
            "Rendering",
            "How React calculates and updates the UI.",
          ),
          leaf(
            "react-conditional-rendering",
            "Conditional Rendering",
            "Showing different UI based on application state.",
          ),
          leaf(
            "react-lists",
            "Lists & Keys",
            "Rendering collections and identifying list items correctly.",
          ),
          leaf(
            "react-events",
            "Event Handling",
            "Responding to user interactions in React components.",
          ),
        ],
      ),
      category(
        "react-hooks",
        "Hooks",
        "Reusable React APIs for component behavior.",
        [
          leaf(
            "react-use-state",
            "useState",
            "Hook for adding state to a component.",
          ),
          leaf(
            "react-use-effect",
            "useEffect",
            "Hook for synchronizing with external systems.",
          ),
          leaf(
            "react-use-context",
            "useContext",
            "Reading values from a React context.",
          ),
          leaf(
            "react-use-ref",
            "useRef",
            "Keeping mutable values or references without triggering renders.",
          ),
          leaf(
            "react-use-memo",
            "useMemo",
            "Memoizing calculated values between renders.",
          ),
          leaf(
            "react-use-callback",
            "useCallback",
            "Memoizing function references between renders.",
          ),
          leaf(
            "react-use-reducer",
            "useReducer",
            "Managing state transitions with a reducer function.",
          ),
          leaf(
            "react-custom-hooks",
            "Custom Hooks",
            "Extracting reusable stateful logic into custom hooks.",
          ),
        ],
      ),
      category(
        "react-state-management",
        "State Management",
        "Patterns for storing and coordinating application state.",
        [
          leaf(
            "react-context",
            "Context",
            "Sharing values across a component tree.",
          ),
          leaf(
            "react-zustand",
            "Zustand",
            "Lightweight external state management for React.",
          ),
          leaf(
            "react-client-state",
            "Client State",
            "State that primarily represents local UI or client behavior.",
          ),
          leaf(
            "react-server-state",
            "Server State",
            "Managing data that originates from a remote server.",
          ),
          leaf(
            "react-derived-state",
            "Derived State",
            "Values calculated from existing state or props.",
          ),
          leaf(
            "react-state-updates",
            "State Updates",
            "How React schedules and applies state changes.",
          ),
        ],
      ),
      category(
        "react-forms-ui",
        "Forms & UI",
        "Building interactive form and composition patterns.",
        [
          leaf(
            "react-controlled-components",
            "Controlled Components",
            "Form values controlled by React state.",
          ),
          leaf(
            "react-uncontrolled-components",
            "Uncontrolled Components",
            "Form values managed by the DOM instead of React state.",
          ),
          leaf(
            "react-form-validation",
            "Form Validation",
            "Checking form data before it is submitted.",
          ),
          leaf(
            "react-composition",
            "Composition",
            "Building flexible components by composing smaller components.",
          ),
        ],
      ),
      category(
        "react-performance",
        "Performance",
        "Understanding and improving React rendering performance.",
        [
          leaf(
            "react-rerendering",
            "Rerendering",
            "Understanding when and why React components render again.",
          ),
          leaf(
            "react-memoization",
            "Memoization",
            "Avoiding repeated work when inputs have not changed.",
          ),
          leaf(
            "react-memo",
            "React.memo",
            "Skipping component renders when props remain equivalent.",
          ),
          leaf(
            "react-code-splitting",
            "Code Splitting",
            "Loading JavaScript in smaller chunks.",
          ),
          leaf(
            "react-lazy-loading",
            "Lazy Loading",
            "Deferring work until it is actually needed.",
          ),
        ],
      ),
      category(
        "react-testing",
        "Testing",
        "Testing React components and user interactions.",
        [
          leaf(
            "react-testing-library",
            "React Testing Library",
            "Testing components through user-visible behavior.",
          ),
          leaf(
            "react-component-testing",
            "Component Testing",
            "Verifying component behavior in isolation or near isolation.",
          ),
          leaf(
            "react-hook-testing",
            "Hook Testing",
            "Testing reusable hook behavior.",
          ),
        ],
      ),
    ],
  },

  {
    id: "nextjs",
    name: "Next.js",
    slug: "nextjs",
    description: "Framework for building full-stack React applications.",
    children: [
      category(
        "nextjs-app-router",
        "App Router",
        "Routing and application structure in modern Next.js.",
        [
          leaf(
            "nextjs-routing",
            "Routing",
            "Structuring pages and navigation with the App Router.",
          ),
          leaf(
            "nextjs-dynamic-routes",
            "Dynamic Routes",
            "Creating routes whose segments are determined by data.",
          ),
          leaf(
            "nextjs-layouts",
            "Layouts",
            "Sharing UI and structure between routes.",
          ),
          leaf(
            "nextjs-loading",
            "Loading UI",
            "Showing loading interfaces during navigation and data work.",
          ),
          leaf(
            "nextjs-error-handling",
            "Error Handling",
            "Handling failures with route-level error boundaries.",
          ),
          leaf(
            "nextjs-not-found",
            "Not Found",
            "Handling resources and routes that do not exist.",
          ),
          leaf(
            "nextjs-navigation",
            "Navigation",
            "Moving between routes with Next.js navigation APIs.",
          ),
        ],
      ),
      category(
        "nextjs-rendering",
        "Rendering",
        "How and where Next.js renders application content.",
        [
          leaf(
            "nextjs-server-components",
            "Server Components",
            "Rendering components on the server.",
          ),
          leaf(
            "nextjs-client-components",
            "Client Components",
            "Components that require browser-side interactivity.",
          ),
          leaf(
            "nextjs-static-rendering",
            "Static Rendering",
            "Producing reusable HTML ahead of individual requests.",
          ),
          leaf(
            "nextjs-dynamic-rendering",
            "Dynamic Rendering",
            "Rendering content in response to a request.",
          ),
          leaf(
            "nextjs-streaming",
            "Streaming",
            "Sending UI to the browser progressively as it becomes available.",
          ),
          leaf(
            "nextjs-isr",
            "Incremental Static Regeneration",
            "Updating statically rendered content after deployment.",
          ),
        ],
      ),
      category(
        "nextjs-data-mutations",
        "Data & Mutations",
        "Loading, caching, and changing application data.",
        [
          leaf(
            "nextjs-data-fetching",
            "Data Fetching",
            "Getting data from databases, APIs, and other sources.",
          ),
          leaf(
            "nextjs-server-actions",
            "Server Actions",
            "Calling server-side functions from application code.",
          ),
          leaf(
            "nextjs-caching",
            "Caching",
            "Controlling when fetched or generated data can be reused.",
          ),
          leaf(
            "nextjs-revalidation",
            "Revalidation",
            "Refreshing cached data after changes.",
          ),
          leaf(
            "nextjs-route-handlers",
            "Route Handlers",
            "Creating HTTP endpoints inside the App Router.",
          ),
        ],
      ),
      category(
        "nextjs-application",
        "Application Concerns",
        "Cross-cutting concerns commonly handled inside Next.js applications.",
        [
          leaf(
            "nextjs-authentication",
            "Authentication",
            "Identifying users and managing signed-in sessions.",
          ),
          leaf(
            "nextjs-authorization",
            "Authorization",
            "Controlling what authenticated users are allowed to access.",
          ),
          leaf(
            "nextjs-middleware",
            "Middleware",
            "Running logic before requests reach application routes.",
          ),
          leaf(
            "nextjs-metadata",
            "Metadata & SEO",
            "Managing page metadata and search engine discoverability.",
          ),
          leaf(
            "nextjs-environment-variables",
            "Environment Variables",
            "Providing configuration values to different environments.",
          ),
          leaf(
            "nextjs-deployment",
            "Deployment",
            "Building and running Next.js applications in production.",
          ),
        ],
      ),
    ],
  },

  {
    id: "html",
    name: "HTML",
    slug: "html",
    description: "Structuring web documents with semantic markup.",
    children: [
      category(
        "html-semantics",
        "Semantics",
        "Using meaningful HTML elements to describe document structure.",
        [
          leaf("html-document-structure", "Document Structure"),
          leaf("html-headings", "Headings"),
          leaf("html-links", "Links"),
          leaf("html-images", "Images"),
          leaf("html-tables", "Tables"),
          leaf("html-embedding", "Embedded Content"),
        ],
      ),
      category(
        "html-forms",
        "Forms",
        "Collecting and submitting user input through HTML.",
        [
          leaf("html-inputs", "Inputs"),
          leaf("html-labels", "Labels"),
          leaf("html-validation", "Validation"),
          leaf("html-form-submission", "Form Submission"),
          leaf("html-selects", "Selects"),
        ],
      ),
      category(
        "html-accessibility",
        "Accessibility",
        "Making web content usable by people with different abilities.",
        [
          leaf("html-aria", "ARIA"),
          leaf("html-keyboard-navigation", "Keyboard Navigation"),
          leaf("html-screen-readers", "Screen Readers"),
          leaf("html-focus-management", "Focus Management"),
        ],
      ),
    ],
  },

  {
    id: "css",
    name: "CSS",
    slug: "css",
    description: "Styling and laying out web interfaces.",
    children: [
      category(
        "css-layout",
        "Layout",
        "Controlling how elements are sized and positioned.",
        [
          leaf("css-box-model", "Box Model"),
          leaf("css-flexbox", "Flexbox"),
          leaf("css-grid", "Grid"),
          leaf("css-positioning", "Positioning"),
          leaf("css-stacking-context", "Stacking Context"),
          leaf("css-overflow", "Overflow"),
        ],
      ),
      category(
        "css-responsive",
        "Responsive Design",
        "Building interfaces that adapt to different viewport sizes.",
        [
          leaf("css-media-queries", "Media Queries"),
          leaf("css-container-queries", "Container Queries"),
          leaf("css-mobile-first", "Mobile First"),
          leaf("css-responsive-units", "Responsive Units"),
        ],
      ),
      category(
        "css-styling",
        "Styling",
        "Core rules that determine how CSS is applied.",
        [
          leaf("css-selectors", "Selectors"),
          leaf("css-specificity", "Specificity"),
          leaf("css-cascade", "Cascade"),
          leaf("css-inheritance", "Inheritance"),
          leaf("css-pseudo-classes", "Pseudo Classes"),
          leaf("css-custom-properties", "Custom Properties"),
        ],
      ),
      category(
        "css-motion",
        "Motion",
        "Creating visual transitions and movement.",
        [
          leaf("css-transitions", "Transitions"),
          leaf("css-animations", "Animations"),
          leaf("css-transforms", "Transforms"),
        ],
      ),
    ],
  },

  {
    id: "web-platform",
    name: "Browser & Web Platform",
    slug: "web-platform",
    description: "Browser APIs and the foundations of web applications.",
    children: [
      category(
        "web-platform-dom",
        "DOM",
        "The document object model exposed by browsers.",
        [
          leaf("web-dom-tree", "DOM Tree"),
          leaf("web-element-selection", "Element Selection"),
          leaf("web-dom-manipulation", "DOM Manipulation"),
          leaf("web-event-propagation", "Event Propagation"),
          leaf("web-event-delegation", "Event Delegation"),
        ],
      ),
      category(
        "web-browser-apis",
        "Browser APIs",
        "Capabilities exposed by the web platform.",
        [
          leaf("web-fetch", "Fetch"),
          leaf("web-storage", "Web Storage"),
          leaf("web-cookies", "Cookies"),
          leaf("web-workers", "Web Workers"),
          leaf("web-geolocation", "Geolocation"),
          leaf("web-notifications", "Notifications"),
          leaf("web-clipboard", "Clipboard"),
        ],
      ),
      category(
        "web-platform-core",
        "Web Platform",
        "Core browser-level web concepts and protocols.",
        [
          leaf("web-urls", "URLs"),
          leaf("web-history-api", "History API"),
          leaf("web-websockets", "WebSockets"),
          leaf("web-streams", "Streams"),
          leaf("web-abort-controller", "AbortController"),
        ],
      ),
    ],
  },

  {
    id: "java",
    name: "Java",
    slug: "java",
    description: "Object-oriented programming and the Java platform.",
    children: [
      category(
        "java-language",
        "Language",
        "Core Java language constructs and object-oriented concepts.",
        [
          leaf("java-variables-types", "Variables & Types"),
          leaf("java-methods", "Methods"),
          leaf("java-classes-objects", "Classes & Objects"),
          leaf("java-interfaces", "Interfaces"),
          leaf("java-generics", "Generics"),
          leaf("java-exceptions", "Exceptions"),
          leaf("java-enums", "Enums"),
        ],
      ),
      category(
        "java-collections",
        "Collections",
        "Java's collection abstractions and implementations.",
        [
          leaf("java-list", "List"),
          leaf("java-set", "Set"),
          leaf("java-map", "Map"),
          leaf("java-queue", "Queue"),
          leaf(
            "java-collections-framework",
            "Collections Framework",
          ),
        ],
      ),
      category(
        "java-modern",
        "Modern Java",
        "Features that make contemporary Java more expressive.",
        [
          leaf("java-lambdas", "Lambdas"),
          leaf("java-streams", "Streams"),
          leaf("java-optional", "Optional"),
          leaf("java-records", "Records"),
          leaf("java-pattern-matching", "Pattern Matching"),
        ],
      ),
      category(
        "java-concurrency",
        "Concurrency",
        "Writing Java programs that perform concurrent work.",
        [
          leaf("java-threads", "Threads"),
          leaf("java-synchronization", "Synchronization"),
          leaf("java-executors", "Executors"),
          leaf("java-completable-future", "CompletableFuture"),
        ],
      ),
      category(
        "java-jvm",
        "JVM",
        "The runtime that executes Java bytecode.",
        [
          leaf("java-jvm-memory", "JVM Memory"),
          leaf("java-class-loading", "Class Loading"),
          leaf("java-jit", "JIT Compilation"),
          leaf("java-garbage-collection", "Garbage Collection"),
        ],
      ),
    ],
  },

  {
    id: "spring",
    name: "Spring",
    slug: "spring",
    description: "Frameworks and patterns for building Java applications.",
    children: [
      category(
        "spring-boot",
        "Spring Boot",
        "Building and configuring Spring applications.",
        [
          leaf("spring-project-setup", "Project Setup"),
          leaf("spring-configuration", "Configuration"),
          leaf("spring-dependency-injection", "Dependency Injection"),
          leaf("spring-profiles", "Profiles"),
          leaf("spring-application-properties", "Application Properties"),
        ],
      ),
      category(
        "spring-web",
        "Web",
        "Building HTTP APIs and web applications with Spring.",
        [
          leaf("spring-controllers", "Controllers"),
          leaf("spring-request-mapping", "Request Mapping"),
          leaf("spring-validation", "Validation"),
          leaf("spring-exception-handling", "Exception Handling"),
          leaf("spring-rest-apis", "REST APIs"),
        ],
      ),
      category(
        "spring-data",
        "Data",
        "Working with databases through the Spring data ecosystem.",
        [
          leaf("spring-data-jpa", "Spring Data JPA"),
          leaf("spring-repositories", "Repositories"),
          leaf("spring-transactions", "Transactions"),
          leaf("spring-pagination", "Pagination"),
          leaf("spring-specifications", "Specifications"),
        ],
      ),
      category(
        "spring-security",
        "Security",
        "Securing Spring applications and APIs.",
        [
          leaf("spring-authentication", "Authentication"),
          leaf("spring-authorization", "Authorization"),
          leaf("spring-security-filters", "Security Filters"),
          leaf("spring-jwt", "JWT"),
        ],
      ),
    ],
  },

  {
    id: "nodejs",
    name: "Node.js",
    slug: "nodejs",
    description: "Server-side JavaScript runtime and backend development.",
    children: [
      category(
        "nodejs-runtime",
        "Runtime",
        "The Node.js runtime and its built-in capabilities.",
        [
          leaf("nodejs-modules", "Modules"),
          leaf("nodejs-npm", "npm"),
          leaf("nodejs-event-loop", "Event Loop"),
          leaf("nodejs-streams", "Streams"),
          leaf("nodejs-file-system", "File System"),
        ],
      ),
      category(
        "nodejs-backend",
        "Backend",
        "Building backend applications with Node.js.",
        [
          leaf("nodejs-http-server", "HTTP Server"),
          leaf("nodejs-express", "Express"),
          leaf("nodejs-validation", "Validation"),
          leaf("nodejs-error-handling", "Error Handling"),
          leaf("nodejs-environment-config", "Environment Configuration"),
        ],
      ),
      category(
        "nodejs-architecture",
        "Architecture",
        "Structuring maintainable Node.js applications.",
        [
          leaf("nodejs-services", "Services"),
          leaf("nodejs-middleware", "Middleware"),
          leaf("nodejs-dependency-injection", "Dependency Injection"),
          leaf("nodejs-background-jobs", "Background Jobs"),
        ],
      ),
    ],
  },

  {
    id: "backend",
    name: "Backend Engineering",
    slug: "backend",
    description: "Designing reliable server-side applications and services.",
    children: [
      category(
        "backend-architecture",
        "Architecture",
        "Patterns for organizing backend systems.",
        [
          leaf("backend-layered-architecture", "Layered Architecture"),
          leaf("backend-service-layer", "Service Layer"),
          leaf("backend-repository-pattern", "Repository Pattern"),
          leaf("backend-modular-architecture", "Modular Architecture"),
        ],
      ),
      category(
        "backend-api-design",
        "API Design",
        "Designing clear and maintainable application interfaces.",
        [
          leaf("backend-rest", "REST"),
          leaf("backend-http-methods", "HTTP Methods"),
          leaf("backend-status-codes", "Status Codes"),
          leaf("backend-pagination", "Pagination"),
          leaf("backend-filtering-sorting", "Filtering & Sorting"),
          leaf("backend-versioning", "Versioning"),
        ],
      ),
      category(
        "backend-reliability",
        "Reliability",
        "Making backend systems predictable and resilient.",
        [
          leaf("backend-validation", "Validation"),
          leaf("backend-error-handling", "Error Handling"),
          leaf("backend-logging", "Logging"),
          leaf("backend-retries", "Retries"),
          leaf("backend-idempotency", "Idempotency"),
        ],
      ),
    ],
  },

  {
    id: "databases",
    name: "Databases",
    slug: "databases",
    description: "Storing, querying, and organizing application data.",
    children: [
      category(
        "databases-relational",
        "Relational Databases",
        "Core concepts behind relational data storage.",
        [
          leaf("database-tables", "Tables"),
          leaf("database-primary-keys", "Primary Keys"),
          leaf("database-foreign-keys", "Foreign Keys"),
          leaf("database-relationships", "Relationships"),
          leaf("database-normalization", "Normalization"),
          leaf("database-constraints", "Constraints"),
        ],
      ),
      category(
        "databases-sql",
        "SQL",
        "Querying and manipulating relational data with SQL.",
        [
          leaf("sql-select", "SELECT"),
          leaf("sql-joins", "JOINs"),
          leaf("sql-aggregation", "Aggregation"),
          leaf("sql-subqueries", "Subqueries"),
          leaf("sql-ctes", "CTEs"),
          leaf("sql-window-functions", "Window Functions"),
          leaf("sql-transactions", "Transactions"),
        ],
      ),
      category(
        "databases-performance",
        "Performance",
        "Improving database query and connection performance.",
        [
          leaf("database-indexes", "Indexes"),
          leaf("database-composite-indexes", "Composite Indexes"),
          leaf("database-query-plans", "Query Plans"),
          leaf("database-query-optimization", "Query Optimization"),
          leaf("database-connection-pooling", "Connection Pooling"),
        ],
      ),
      category(
        "databases-nosql",
        "NoSQL",
        "Database models that do not primarily use relational tables.",
        [
          leaf("database-mongodb", "MongoDB"),
          leaf("database-document-modeling", "Document Modeling"),
          leaf("database-key-value", "Key-Value Stores"),
          leaf("database-caching-stores", "Caching Databases"),
        ],
      ),
    ],
  },

  {
    id: "postgresql",
    name: "PostgreSQL",
    slug: "postgresql",
    description: "PostgreSQL database concepts and implementation details.",
    children: [
      category(
        "postgresql-core",
        "Core",
        "Fundamental PostgreSQL features and data modeling.",
        [
          leaf("postgresql-schemas", "Schemas"),
          leaf("postgresql-data-types", "Data Types"),
          leaf("postgresql-constraints", "Constraints"),
          leaf("postgresql-transactions", "Transactions"),
        ],
      ),
      category(
        "postgresql-advanced",
        "Advanced",
        "Features that extend PostgreSQL beyond basic relational queries.",
        [
          leaf("postgresql-jsonb", "JSONB"),
          leaf("postgresql-arrays", "Arrays"),
          leaf("postgresql-full-text-search", "Full Text Search"),
          leaf("postgresql-ctes", "Common Table Expressions"),
        ],
      ),
      category(
        "postgresql-performance",
        "Performance",
        "Managing PostgreSQL query and database performance.",
        [
          leaf("postgresql-indexes", "Indexes"),
          leaf("postgresql-explain", "EXPLAIN"),
          leaf("postgresql-vacuum", "Vacuum"),
          leaf("postgresql-connections", "Connection Management"),
        ],
      ),
    ],
  },

  {
    id: "mysql",
    name: "MySQL",
    slug: "mysql",
    description: "MySQL database concepts and application usage.",
    children: [
      category(
        "mysql-core",
        "Core",
        "Fundamental MySQL data storage concepts.",
        [
          leaf("mysql-storage-engines", "Storage Engines"),
          leaf("mysql-data-types", "Data Types"),
          leaf("mysql-constraints", "Constraints"),
          leaf("mysql-transactions", "Transactions"),
        ],
      ),
      category(
        "mysql-sql",
        "SQL",
        "Querying and manipulating data in MySQL.",
        [
          leaf("mysql-joins", "Joins"),
          leaf("mysql-aggregations", "Aggregations"),
          leaf("mysql-subqueries", "Subqueries"),
          leaf("mysql-ctes", "CTEs"),
        ],
      ),
      category(
        "mysql-performance",
        "Performance",
        "Improving query and database performance in MySQL.",
        [
          leaf("mysql-indexes", "Indexes"),
          leaf("mysql-query-plans", "Query Plans"),
          leaf("mysql-optimization", "Optimization"),
        ],
      ),
    ],
  },

  {
    id: "prisma",
    name: "Prisma",
    slug: "prisma",
    description: "Type-safe database access and schema management.",
    children: [
      category(
        "prisma-schema",
        "Schema",
        "Defining database models and relationships in Prisma.",
        [
          leaf("prisma-models", "Models"),
          leaf("prisma-relations", "Relations"),
          leaf("prisma-enums", "Enums"),
          leaf("prisma-indexes", "Indexes"),
          leaf("prisma-constraints", "Constraints"),
        ],
      ),
      category(
        "prisma-client",
        "Client",
        "Reading and changing database data through Prisma Client.",
        [
          leaf("prisma-queries", "Queries"),
          leaf("prisma-mutations", "Mutations"),
          leaf("prisma-transactions", "Transactions"),
          leaf("prisma-filtering", "Filtering"),
        ],
      ),
      category(
        "prisma-migrations",
        "Migrations",
        "Managing database schema changes safely.",
        [
          leaf("prisma-migration-workflow", "Migration Workflow"),
          leaf("prisma-migration-deployment", "Migration Deployment"),
          leaf("prisma-schema-changes", "Schema Changes"),
          leaf("prisma-seeding", "Database Seeding"),
        ],
      ),
    ],
  },

  {
    id: "git",
    name: "Git",
    slug: "git",
    description: "Version control and collaborative source management.",
    children: [
      category(
        "git-fundamentals",
        "Fundamentals",
        "The basic workflow of Git repositories.",
        [
          leaf("git-repositories", "Repositories"),
          leaf("git-commits", "Commits"),
          leaf("git-branches", "Branches"),
          leaf("git-remotes", "Remotes"),
          leaf("git-tags", "Tags"),
        ],
      ),
      category(
        "git-collaboration",
        "Collaboration",
        "Working with Git as part of a team.",
        [
          leaf("git-pull-requests", "Pull Requests"),
          leaf("git-merge-conflicts", "Merge Conflicts"),
          leaf("git-code-review", "Code Review"),
          leaf("git-branching-strategies", "Branching Strategies"),
        ],
      ),
      category(
        "git-history",
        "History",
        "Rewriting, inspecting, and manipulating Git history.",
        [
          leaf("git-rebase", "Rebase"),
          leaf("git-reset", "Reset"),
          leaf("git-revert", "Revert"),
          leaf("git-cherry-pick", "Cherry Pick"),
          leaf("git-bisect", "Bisect"),
        ],
      ),
    ],
  },

  {
    id: "testing",
    name: "Testing",
    slug: "testing",
    description: "Verifying software behavior and preventing regressions.",
    children: [
      category(
        "testing-fundamentals",
        "Fundamentals",
        "Core concepts used when designing effective tests.",
        [
          leaf("testing-test-cases", "Test Cases"),
          leaf("testing-assertions", "Assertions"),
          leaf("testing-test-doubles", "Test Doubles"),
          leaf("testing-test-isolation", "Test Isolation"),
        ],
      ),
      category(
        "testing-types",
        "Types",
        "Different levels and styles of software testing.",
        [
          leaf("testing-unit", "Unit Testing"),
          leaf("testing-integration", "Integration Testing"),
          leaf("testing-e2e", "End-to-End Testing"),
          leaf("testing-contract", "Contract Testing"),
        ],
      ),
      category(
        "testing-quality",
        "Quality",
        "Practices for making tests reliable and useful.",
        [
          leaf("testing-coverage", "Test Coverage"),
          leaf("testing-test-data", "Test Data"),
          leaf("testing-mocking", "Mocking"),
          leaf("testing-strategies", "Testing Strategies"),
        ],
      ),
    ],
  },

  {
    id: "security",
    name: "Security",
    slug: "security",
    description: "Protecting applications, users, and data.",
    children: [
      category(
        "security-web",
        "Web Security",
        "Common vulnerabilities and defenses for web applications.",
        [
          leaf("security-xss", "XSS"),
          leaf("security-csrf", "CSRF"),
          leaf("security-cors", "CORS"),
          leaf("security-sql-injection", "SQL Injection"),
          leaf("security-clickjacking", "Clickjacking"),
          leaf("security-security-headers", "Security Headers"),
        ],
      ),
      category(
        "security-authentication",
        "Authentication",
        "Verifying user identity securely.",
        [
          leaf("security-passwords", "Passwords"),
          leaf("security-sessions", "Sessions"),
          leaf("security-jwt", "JWT"),
          leaf("security-oauth", "OAuth 2.0"),
          leaf("security-mfa", "Multi-Factor Authentication"),
        ],
      ),
      category(
        "security-authorization",
        "Authorization",
        "Controlling access to protected resources.",
        [
          leaf("security-rbac", "RBAC"),
          leaf("security-permissions", "Permissions"),
          leaf(
            "security-resource-ownership",
            "Resource Ownership",
          ),
          leaf("security-access-control", "Access Control"),
        ],
      ),
      category(
        "security-application",
        "Application Security",
        "Practices for reducing security risks in application code.",
        [
          leaf("security-secrets", "Secrets Management"),
          leaf("security-input-validation", "Input Validation"),
          leaf("security-rate-limiting", "Rate Limiting"),
          leaf("security-password-hashing", "Password Hashing"),
        ],
      ),
    ],
  },

  {
    id: "networking",
    name: "Networking",
    slug: "networking",
    description: "How systems communicate across networks.",
    children: [
      category(
        "networking-core",
        "Core",
        "Foundational networking concepts.",
        [
          leaf("networking-ip-addresses", "IP Addresses"),
          leaf("networking-ports", "Ports"),
          leaf("networking-tcp", "TCP"),
          leaf("networking-udp", "UDP"),
          leaf("networking-dns", "DNS"),
        ],
      ),
      category(
        "networking-web",
        "Web Networking",
        "Networking concepts used by modern web applications.",
        [
          leaf("networking-http", "HTTP"),
          leaf("networking-https", "HTTPS"),
          leaf("networking-tls", "TLS"),
          leaf("networking-cookies", "Cookies"),
          leaf("networking-proxies", "Proxies"),
        ],
      ),
      category(
        "networking-distributed",
        "Distributed Communication",
        "Communication patterns between services and clients.",
        [
          leaf("networking-websockets", "WebSockets"),
          leaf("networking-load-balancing", "Load Balancing"),
          leaf("networking-cdns", "CDNs"),
        ],
      ),
    ],
  },

  {
    id: "devops",
    name: "DevOps",
    slug: "devops",
    description: "Automating software delivery and application operations.",
    children: [
      category(
        "devops-containers",
        "Containers",
        "Packaging and running applications in isolated environments.",
        [
          leaf("devops-docker", "Docker"),
          leaf("devops-docker-images", "Docker Images"),
          leaf("devops-docker-compose", "Docker Compose"),
          leaf("devops-container-networking", "Container Networking"),
        ],
      ),
      category(
        "devops-cicd",
        "CI/CD",
        "Automating testing, building, and deployment.",
        [
          leaf("devops-continuous-integration", "Continuous Integration"),
          leaf(
            "devops-continuous-deployment",
            "Continuous Deployment",
          ),
          leaf("devops-github-actions", "GitHub Actions"),
          leaf("devops-deployment-pipelines", "Deployment Pipelines"),
        ],
      ),
      category(
        "devops-operations",
        "Operations",
        "Keeping deployed applications observable and healthy.",
        [
          leaf("devops-environment-variables", "Environment Variables"),
          leaf("devops-logging", "Logging"),
          leaf("devops-monitoring", "Monitoring"),
          leaf("devops-health-checks", "Health Checks"),
        ],
      ),
    ],
  },

  {
    id: "cloud",
    name: "Cloud & Deployment",
    slug: "cloud",
    description: "Running applications on modern cloud infrastructure.",
    children: [
      category(
        "cloud-vercel",
        "Vercel",
        "Deploying modern web applications with Vercel.",
        [
          leaf("cloud-vercel-nextjs", "Next.js Deployment"),
          leaf("cloud-vercel-environment", "Environment Variables"),
          leaf("cloud-vercel-previews", "Preview Deployments"),
          leaf("cloud-vercel-domains", "Custom Domains"),
        ],
      ),
      category(
        "cloud-aws",
        "AWS",
        "Core AWS services and cloud infrastructure concepts.",
        [
          leaf("cloud-aws-ec2", "EC2"),
          leaf("cloud-aws-rds", "RDS"),
          leaf("cloud-aws-s3", "S3"),
          leaf("cloud-aws-lambda", "Lambda"),
          leaf("cloud-aws-iam", "IAM"),
        ],
      ),
      category(
        "cloud-concepts",
        "Cloud Concepts",
        "Fundamental ideas behind cloud-hosted systems.",
        [
          leaf("cloud-regions", "Regions"),
          leaf("cloud-availability-zones", "Availability Zones"),
          leaf("cloud-serverless", "Serverless"),
          leaf("cloud-managed-services", "Managed Services"),
        ],
      ),
    ],
  },

  {
    id: "software-architecture",
    name: "Software Architecture",
    slug: "software-architecture",
    description: "Structuring software systems for maintainability and scale.",
    children: [
      category(
        "architecture-application",
        "Application Architecture",
        "Approaches for organizing application responsibilities.",
        [
          leaf("architecture-monoliths", "Monoliths"),
          leaf("architecture-modular-monoliths", "Modular Monoliths"),
          leaf("architecture-microservices", "Microservices"),
          leaf("architecture-clean-architecture", "Clean Architecture"),
          leaf(
            "architecture-hexagonal",
            "Hexagonal Architecture",
          ),
        ],
      ),
      category(
        "architecture-distributed",
        "Distributed Systems",
        "Patterns and trade-offs in systems spread across machines.",
        [
          leaf(
            "architecture-service-communication",
            "Service Communication",
          ),
          leaf("architecture-consistency", "Consistency"),
          leaf("architecture-replication", "Replication"),
          leaf("architecture-distributed-caching", "Caching"),
        ],
      ),
      category(
        "architecture-design",
        "Design Concepts",
        "Principles that improve the structure of software.",
        [
          leaf("architecture-coupling", "Coupling"),
          leaf("architecture-cohesion", "Cohesion"),
          leaf(
            "architecture-separation-of-concerns",
            "Separation of Concerns",
          ),
          leaf(
            "architecture-dependency-inversion",
            "Dependency Inversion",
          ),
        ],
      ),
    ],
  },

  {
    id: "system-design",
    name: "System Design",
    slug: "system-design",
    description: "Designing software systems for scale, reliability, and change.",
    children: [
      category(
        "system-design-fundamentals",
        "Fundamentals",
        "Core concerns when designing larger systems.",
        [
          leaf("system-design-requirements", "Requirements"),
          leaf("system-design-scalability", "Scalability"),
          leaf("system-design-availability", "Availability"),
          leaf("system-design-reliability", "Reliability"),
        ],
      ),
      category(
        "system-design-components",
        "Components",
        "Common building blocks used in scalable systems.",
        [
          leaf("system-design-load-balancers", "Load Balancers"),
          leaf("system-design-caches", "Caches"),
          leaf("system-design-message-queues", "Message Queues"),
          leaf("system-design-databases", "Databases"),
          leaf("system-design-object-storage", "Object Storage"),
        ],
      ),
      category(
        "system-design-patterns",
        "Design Patterns",
        "Reusable strategies for solving system-level problems.",
        [
          leaf("system-design-caching-patterns", "Caching Patterns"),
          leaf(
            "system-design-event-driven",
            "Event-Driven Architecture",
          ),
          leaf("system-design-rate-limiting", "Rate Limiting"),
          leaf(
            "system-design-async-processing",
            "Asynchronous Processing",
          ),
        ],
      ),
    ],
  },

  {
    id: "performance",
    name: "Performance",
    slug: "performance",
    description: "Measuring and improving application performance.",
    children: [
      category(
        "performance-frontend",
        "Frontend Performance",
        "Improving the speed and responsiveness of web interfaces.",
        [
          leaf(
            "performance-rendering",
            "Rendering Performance",
          ),
          leaf("performance-bundle-size", "Bundle Size"),
          leaf("performance-lazy-loading", "Lazy Loading"),
          leaf("performance-image-optimization", "Image Optimization"),
          leaf("performance-frontend-caching", "Caching"),
        ],
      ),
      category(
        "performance-backend",
        "Backend Performance",
        "Improving server response times and resource usage.",
        [
          leaf("performance-profiling", "Profiling"),
          leaf("performance-concurrency", "Concurrency"),
          leaf("performance-connection-pooling", "Connection Pooling"),
          leaf("performance-backend-caching", "Caching"),
        ],
      ),
      category(
        "performance-database",
        "Database Performance",
        "Optimizing queries and database access.",
        [
          leaf("performance-indexes", "Indexes"),
          leaf("performance-query-optimization", "Query Optimization"),
          leaf("performance-query-plans", "Query Plans"),
        ],
      ),
    ],
  },

  {
    id: "computer-science",
    name: "Computer Science",
    slug: "computer-science",
    description: "Foundational computing concepts and problem-solving techniques.",
    children: [
      category(
        "computer-science-data-structures",
        "Data Structures",
        "Ways of organizing data for efficient access and modification.",
        [
          leaf("cs-arrays", "Arrays"),
          leaf("cs-linked-lists", "Linked Lists"),
          leaf("cs-stacks", "Stacks"),
          leaf("cs-queues", "Queues"),
          leaf("cs-hash-tables", "Hash Tables"),
          leaf("cs-trees", "Trees"),
          leaf("cs-heaps", "Heaps"),
          leaf("cs-graphs", "Graphs"),
        ],
      ),
      category(
        "computer-science-algorithms",
        "Algorithms",
        "General techniques for solving computational problems.",
        [
          leaf("cs-searching", "Searching"),
          leaf("cs-sorting", "Sorting"),
          leaf("cs-recursion", "Recursion"),
          leaf("cs-greedy", "Greedy Algorithms"),
          leaf("cs-dynamic-programming", "Dynamic Programming"),
          leaf("cs-graph-algorithms", "Graph Algorithms"),
        ],
      ),
      category(
        "computer-science-complexity",
        "Complexity",
        "Reasoning about the resources algorithms require.",
        [
          leaf("cs-big-o", "Big O"),
          leaf("cs-time-complexity", "Time Complexity"),
          leaf("cs-space-complexity", "Space Complexity"),
        ],
      ),
    ],
  },

  {
    id: "operating-systems",
    name: "Operating Systems",
    slug: "operating-systems",
    description: "How operating systems manage processes, memory, and hardware.",
    children: [
      category(
        "os-processes-threads",
        "Processes & Threads",
        "How operating systems execute and schedule work.",
        [
          leaf("os-processes", "Processes"),
          leaf("os-threads", "Threads"),
          leaf("os-scheduling", "Scheduling"),
          leaf("os-concurrency", "Concurrency"),
        ],
      ),
      category(
        "os-memory",
        "Memory",
        "How operating systems manage and isolate memory.",
        [
          leaf("os-stack-heap", "Stack & Heap"),
          leaf("os-virtual-memory", "Virtual Memory"),
          leaf("os-memory-management", "Memory Management"),
        ],
      ),
      category(
        "os-files",
        "File Systems",
        "How operating systems organize persistent data.",
        [
          leaf("os-files", "Files"),
          leaf("os-directories", "Directories"),
          leaf("os-permissions", "Permissions"),
        ],
      ),
    ],
  },

  {
    id: "linux",
    name: "Linux",
    slug: "linux",
    description: "Linux command-line usage and system administration.",
    children: [
      category(
        "linux-shell",
        "Shell",
        "Working with Linux through the command line.",
        [
          leaf("linux-terminal", "Terminal"),
          leaf("linux-shell-commands", "Shell Commands"),
          leaf("linux-pipes-redirection", "Pipes & Redirection"),
          leaf("linux-environment", "Environment Variables"),
        ],
      ),
      category(
        "linux-administration",
        "System Administration",
        "Managing processes, users, services, and packages.",
        [
          leaf("linux-processes", "Processes"),
          leaf("linux-permissions", "Permissions"),
          leaf("linux-users-groups", "Users & Groups"),
          leaf("linux-services", "Services"),
          leaf("linux-packages", "Package Management"),
        ],
      ),
    ],
  },

  {
    id: "software-engineering",
    name: "Software Engineering",
    slug: "software-engineering",
    description: "Practices for building and maintaining software professionally.",
    children: [
      category(
        "software-engineering-code-quality",
        "Code Quality",
        "Practices that make code easier to understand and maintain.",
        [
          leaf("se-code-review", "Code Review"),
          leaf("se-refactoring", "Refactoring"),
          leaf("se-code-smells", "Code Smells"),
          leaf("se-readability", "Readability"),
        ],
      ),
      category(
        "software-engineering-debugging",
        "Debugging",
        "Finding and fixing the causes of incorrect behavior.",
        [
          leaf("se-debugging-process", "Debugging Process"),
          leaf("se-breakpoints", "Breakpoints"),
          leaf("se-logging-debugging", "Logging"),
          leaf("se-root-cause-analysis", "Root Cause Analysis"),
        ],
      ),
      category(
        "software-engineering-documentation",
        "Documentation",
        "Communicating software behavior and design.",
        [
          leaf("se-readmes", "README Files"),
          leaf("se-api-documentation", "API Documentation"),
          leaf("se-architecture-docs", "Architecture Documentation"),
        ],
      ),
      category(
        "software-engineering-agile",
        "Agile",
        "Iterative approaches to planning and delivering software.",
        [
          leaf("se-sprints", "Sprints"),
          leaf("se-user-stories", "User Stories"),
          leaf("se-backlogs", "Backlogs"),
          leaf("se-retrospectives", "Retrospectives"),
        ],
      ),
    ],
  },

  {
    id: "mobile-development",
    name: "Mobile Development",
    slug: "mobile-development",
    description: "Building applications for mobile platforms.",
    children: [
      category(
        "mobile-flutter",
        "Flutter",
        "Cross-platform mobile development with Flutter.",
        [
          leaf("flutter-widgets", "Widgets"),
          leaf("flutter-state", "State Management"),
          leaf("flutter-navigation", "Navigation"),
          leaf("flutter-forms", "Forms"),
          leaf("flutter-networking", "Networking"),
          leaf("flutter-persistence", "Local Persistence"),
        ],
      ),
      category(
        "mobile-android",
        "Android",
        "Native Android application development concepts.",
        [
          leaf("android-activities", "Activities"),
          leaf("android-fragments", "Fragments"),
          leaf("android-jetpack", "Jetpack"),
          leaf("android-room", "Room"),
        ],
      ),
    ],
  },

  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    slug: "ai-ml",
    description: "Artificial intelligence concepts and modern AI applications.",
    children: [
      category(
        "ai-fundamentals",
        "AI Fundamentals",
        "Core ideas behind artificial intelligence and machine learning.",
        [
          leaf("ai-artificial-intelligence", "Artificial Intelligence"),
          leaf("ai-machine-learning", "Machine Learning"),
          leaf("ai-supervised-learning", "Supervised Learning"),
          leaf("ai-unsupervised-learning", "Unsupervised Learning"),
        ],
      ),
      category(
        "ai-llm",
        "LLM Applications",
        "Building applications around large language models.",
        [
          leaf("ai-large-language-models", "Large Language Models"),
          leaf("ai-prompting", "Prompting"),
          leaf("ai-embeddings", "Embeddings"),
          leaf("ai-rag", "Retrieval-Augmented Generation"),
          leaf("ai-tool-calling", "Tool Calling"),
        ],
      ),
      category(
        "ai-engineering",
        "ML Engineering",
        "Engineering practices for deploying and operating AI systems.",
        [
          leaf("ai-data-pipelines", "Data Pipelines"),
          leaf("ai-model-evaluation", "Model Evaluation"),
          leaf("ai-inference", "Inference"),
          leaf("ai-model-deployment", "Model Deployment"),
        ],
      ),
    ],
  },
];

function flattenTopics(
  nodes: TopicNode[],
  parentId: string | null = null,
): Array<{
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  sortOrder: number;
}> {
  return nodes.flatMap((node, index) => {
    const current = {
      id: node.id,
      name: node.name,
      slug: node.slug,
      description: node.description,
      parentId,
      sortOrder: index + 1,
    };

    const children = node.children
      ? flattenTopics(node.children, node.id)
      : [];

    return [current, ...children];
  });
}

const topics = flattenTopics(topicTree);

async function main() {
  for (const topic of topics) {
    await prisma.topic.upsert({
      where: {
        id: topic.id,
      },
      update: {
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        parentId: topic.parentId,
        sortOrder: topic.sortOrder,
        createdByUserId: null,
      },
      create: {
        ...topic,
        createdByUserId: null,
      },
    });
  }

  console.log(
    `Database seeded successfully with ${topics.length} system topics.`,
  );
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });