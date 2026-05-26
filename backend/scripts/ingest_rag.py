"""
Seed knowledge_chunks with general learning content.
Run once:  python scripts/ingest_rag.py
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from app.services.rag_service import ingest_chunk
from app.database import supabase

DOCUMENTS = [

    # ─── PYTHON ───────────────────────────────────────────────
    {
        "content": """Python basics every beginner must know:
Variables and data types: int, float, str, bool, list, dict, tuple, set.
Control flow: if/elif/else, for loops, while loops, break, continue.
Functions: def, return, *args, **kwargs, lambda functions.
String methods: split, join, strip, replace, format, f-strings.
List comprehensions: [x for x in range(10) if x % 2 == 0].
File I/O: open(), read(), write(), with statement for safe handling.""",
        "source": "https://docs.python.org/3/tutorial/",
        "metadata": {"title": "Python basics for beginners", "category": "skill"},
    },
    {
        "content": """Python intermediate concepts:
Object-oriented programming: classes, __init__, inheritance, polymorphism.
Decorators: @property, @staticmethod, @classmethod, custom decorators.
Generators and iterators: yield, next(), generator expressions.
Context managers: with statement, __enter__, __exit__.
Error handling: try/except/finally, custom exceptions, raising errors.
Modules and packages: import, from, __init__.py, pip install.""",
        "source": "https://realpython.com/python-intermediate-guide/",
        "metadata": {"title": "Python intermediate concepts", "category": "skill"},
    },
    {
        "content": """Python advanced topics:
Async programming: asyncio, async/await, event loops, aiohttp.
Metaclasses and descriptors for advanced OOP patterns.
Memory management: garbage collection, reference counting, weakref.
Multiprocessing vs multithreading: GIL, concurrent.futures, ProcessPoolExecutor.
Type hints: typing module, mypy, Protocol, TypeVar, Generic.
Testing: pytest, unittest, mock, fixtures, parametrize.""",
        "source": "https://realpython.com/python-concurrency/",
        "metadata": {"title": "Python advanced topics", "category": "skill"},
    },
    {
        "content": """Python for data science:
NumPy: arrays, broadcasting, vectorized operations, reshape, indexing.
Pandas: DataFrame, Series, read_csv, groupby, merge, pivot_table, fillna.
Matplotlib: line plots, bar charts, scatter plots, subplots, customization.
Seaborn: heatmaps, pairplots, violin plots, statistical visualization.
Jupyter Notebook: cells, markdown, magic commands, widgets.
SciPy: statistical tests, optimization, linear algebra, signal processing.""",
        "source": "https://pandas.pydata.org/docs/",
        "metadata": {"title": "Python for data science", "category": "skill"},
    },

    # ─── JAVASCRIPT ───────────────────────────────────────────
    {
        "content": """JavaScript fundamentals every developer needs:
Variables: var, let, const — differences and scoping rules.
Data types: string, number, boolean, null, undefined, object, symbol.
Functions: declarations, expressions, arrow functions, closures, IIFE.
Arrays: map, filter, reduce, forEach, find, some, every, flat.
Objects: destructuring, spread operator, Object.keys/values/entries.
Promises and async/await for handling asynchronous operations.""",
        "source": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        "metadata": {"title": "JavaScript fundamentals", "category": "skill"},
    },
    {
        "content": """JavaScript ES6+ modern features:
Template literals for string interpolation with backticks.
Destructuring: const { name, age } = person; const [a, b] = arr.
Spread and rest operators: ...args, [...arr], {...obj}.
Modules: import/export, default exports, named exports.
Optional chaining: obj?.property?.nested safely accesses nested values.
Nullish coalescing: value ?? 'default' returns default only for null/undefined.
Map, Set, WeakMap, WeakSet for advanced data structures.""",
        "source": "https://javascript.info/",
        "metadata": {"title": "JavaScript ES6+ modern features", "category": "skill"},
    },
    {
        "content": """JavaScript DOM manipulation and browser APIs:
Selecting elements: getElementById, querySelector, querySelectorAll.
Modifying DOM: innerHTML, textContent, setAttribute, classList.
Event handling: addEventListener, event delegation, stopPropagation.
Fetch API: fetch(), .then(), async/await, handling errors, JSON parsing.
LocalStorage and SessionStorage for client-side data persistence.
Web APIs: setTimeout, setInterval, requestAnimationFrame, IntersectionObserver.""",
        "source": "https://developer.mozilla.org/en-US/docs/Web/API",
        "metadata": {"title": "JavaScript DOM and browser APIs", "category": "skill"},
    },

    # ─── REACT ────────────────────────────────────────────────
    {
        "content": """React fundamentals:
JSX syntax: HTML-like code inside JavaScript, expressions in curly braces.
Components: functional components, props, children, defaultProps.
State: useState hook, state updates are asynchronous, immutability.
Effects: useEffect for side effects, dependency array, cleanup functions.
Event handling: onClick, onChange, onSubmit with synthetic events.
Conditional rendering: ternary, &&, switch statements in JSX.""",
        "source": "https://react.dev/learn",
        "metadata": {"title": "React fundamentals", "category": "skill"},
    },
    {
        "content": """React hooks deep dive:
useState: managing local component state with getter/setter pairs.
useEffect: runs after render, dependency array controls when it fires.
useContext: consume context without prop drilling.
useReducer: complex state logic, alternative to useState.
useMemo: memoize expensive calculations, only recalculates when deps change.
useCallback: memoize functions to prevent unnecessary re-renders.
useRef: access DOM elements directly, persist values without re-render.
Custom hooks: extract reusable stateful logic into useX functions.""",
        "source": "https://react.dev/reference/react",
        "metadata": {"title": "React hooks deep dive", "category": "skill"},
    },
    {
        "content": """React state management patterns:
Local state with useState for component-specific data.
Context API with useContext for global state without external libraries.
Redux Toolkit: createSlice, configureStore, useSelector, useDispatch.
Zustand: lightweight alternative to Redux, minimal boilerplate.
React Query / TanStack Query: server state management, caching, refetching.
Jotai and Recoil: atomic state management approaches.
When to use what: local for UI state, context for theme/auth, Redux for complex.""",
        "source": "https://redux-toolkit.js.org/",
        "metadata": {"title": "React state management", "category": "skill"},
    },
    {
        "content": """React Router and navigation:
BrowserRouter, Routes, Route for declarative routing.
useNavigate for programmatic navigation between pages.
useParams to access URL parameters like /user/:id.
useLocation to get current URL and state passed via navigation.
Nested routes and layout routes for complex application structures.
Protected routes: redirect unauthenticated users to login page.
Lazy loading routes with React.lazy and Suspense for code splitting.""",
        "source": "https://reactrouter.com/en/main",
        "metadata": {"title": "React Router navigation", "category": "skill"},
    },

    # ─── NODE.JS & EXPRESS ────────────────────────────────────
    {
        "content": """Node.js fundamentals:
Event loop: single-threaded, non-blocking I/O model explained.
Modules: require vs import, CommonJS vs ES modules, module.exports.
Built-in modules: fs, path, http, os, events, stream, crypto.
npm: package.json, node_modules, scripts, dependencies vs devDependencies.
Environment variables: dotenv, process.env, .env files.
Error handling: try/catch, unhandledRejection, uncaughtException.""",
        "source": "https://nodejs.org/en/docs/",
        "metadata": {"title": "Node.js fundamentals", "category": "skill"},
    },
    {
        "content": """Express.js REST API development:
App setup: express(), app.listen(), middleware with app.use().
Routing: app.get(), app.post(), app.put(), app.delete(), router.
Middleware: body-parser, cors, morgan, custom middleware functions.
Request/Response: req.body, req.params, req.query, res.json(), res.status().
Error handling middleware: (err, req, res, next) signature.
Authentication: JWT tokens, express-jwt, passport.js strategies.""",
        "source": "https://expressjs.com/",
        "metadata": {"title": "Express.js REST API", "category": "skill"},
    },

    # ─── DATABASES ────────────────────────────────────────────
    {
        "content": """PostgreSQL essentials:
Data types: INTEGER, TEXT, VARCHAR, BOOLEAN, TIMESTAMP, JSONB, UUID.
CRUD: INSERT INTO, SELECT, UPDATE SET, DELETE FROM with WHERE clauses.
Joins: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN with examples.
Indexes: CREATE INDEX, unique indexes, partial indexes, when to use them.
Transactions: BEGIN, COMMIT, ROLLBACK, SAVEPOINT for data integrity.
Window functions: ROW_NUMBER, RANK, LAG, LEAD, PARTITION BY.
JSON support: JSONB operators ->, ->>, @>, ?, jsonb_set.""",
        "source": "https://www.postgresql.org/docs/",
        "metadata": {"title": "PostgreSQL essentials", "category": "skill"},
    },
    {
        "content": """MongoDB and NoSQL concepts:
Documents: JSON-like BSON format, flexible schema design.
CRUD: insertOne, find, updateOne, deleteOne with filter objects.
Query operators: $eq, $gt, $in, $and, $or, $regex, $exists.
Aggregation pipeline: $match, $group, $sort, $project, $lookup.
Indexes: createIndex, compound indexes, text indexes for search.
Schema design: embedding vs referencing, when to denormalize.
Mongoose ODM: schemas, models, validation, middleware, populate.""",
        "source": "https://www.mongodb.com/docs/",
        "metadata": {"title": "MongoDB and NoSQL", "category": "skill"},
    },
    {
        "content": """Database design principles:
Normalization: 1NF, 2NF, 3NF to reduce data redundancy.
Primary keys, foreign keys, and referential integrity constraints.
Entity-Relationship diagrams for visualizing database structure.
Indexing strategy: index columns used in WHERE, JOIN, ORDER BY.
Connection pooling: pg-pool, SQLAlchemy pool for performance.
ORMs: SQLAlchemy for Python, Prisma for Node.js, benefits and pitfalls.
Migrations: managing schema changes safely in production.""",
        "source": "https://use-the-index-luke.com/",
        "metadata": {"title": "Database design principles", "category": "skill"},
    },

    # ─── MACHINE LEARNING ─────────────────────────────────────
    {
        "content": """Machine learning fundamentals:
Supervised learning: regression (predicting values) and classification (predicting labels).
Unsupervised learning: clustering (k-means), dimensionality reduction (PCA).
Training pipeline: data collection, cleaning, splitting, training, evaluation, deployment.
Overfitting vs underfitting: bias-variance tradeoff, regularization techniques.
Cross-validation: k-fold, stratified k-fold for robust model evaluation.
Feature engineering: encoding categoricals, scaling, creating new features.""",
        "source": "https://scikit-learn.org/stable/user_guide.html",
        "metadata": {"title": "Machine learning fundamentals", "category": "skill"},
    },
    {
        "content": """Scikit-learn practical guide:
Linear models: LinearRegression, LogisticRegression, Ridge, Lasso.
Tree models: DecisionTreeClassifier, RandomForestClassifier, GradientBoostingClassifier.
SVM: SVC, SVR, kernel trick for non-linear classification.
Preprocessing: StandardScaler, MinMaxScaler, LabelEncoder, OneHotEncoder.
Pipelines: Pipeline, ColumnTransformer for clean ML workflows.
Model selection: GridSearchCV, RandomizedSearchCV, cross_val_score.
Metrics: accuracy_score, classification_report, confusion_matrix, roc_auc_score.""",
        "source": "https://scikit-learn.org/stable/",
        "metadata": {"title": "Scikit-learn practical guide", "category": "skill"},
    },
    {
        "content": """Deep learning with PyTorch:
Tensors: creating, reshaping, operations, GPU acceleration with .cuda().
Autograd: automatic differentiation, .backward(), .grad, no_grad context.
Neural networks: nn.Module, nn.Linear, nn.Conv2d, nn.LSTM, forward().
Loss functions: CrossEntropyLoss, MSELoss, BCELoss, custom losses.
Optimizers: SGD, Adam, AdamW, learning rate schedulers.
Training loop: forward pass, loss computation, backward pass, optimizer step.
DataLoader: Dataset class, DataLoader, transforms, batching, shuffling.""",
        "source": "https://pytorch.org/tutorials/",
        "metadata": {"title": "Deep learning with PyTorch", "category": "skill"},
    },
    {
        "content": """Computer vision fundamentals:
CNNs: convolutional layers, pooling, filters, feature maps, receptive field.
Architectures: VGG, ResNet, EfficientNet, MobileNet for different use cases.
Transfer learning: fine-tuning pretrained models, freezing layers, feature extraction.
Data augmentation: random crop, flip, rotation, color jitter, mixup.
Object detection: YOLO, Faster R-CNN, SSD concepts and use cases.
Segmentation: U-Net for semantic segmentation, Mask R-CNN for instance.
Evaluation: mAP, IoU, precision-recall for detection tasks.""",
        "source": "https://pytorch.org/vision/stable/index.html",
        "metadata": {"title": "Computer vision fundamentals", "category": "skill"},
    },
    {
        "content": """Natural language processing basics:
Text preprocessing: tokenization, lowercasing, removing stopwords, stemming.
Bag of Words and TF-IDF for traditional text representation.
Word embeddings: Word2Vec, GloVe, FastText for semantic representations.
Sequence models: RNN, LSTM, GRU for sequential text processing.
Transformers: attention mechanism, BERT, GPT architecture overview.
HuggingFace: pipeline, AutoTokenizer, AutoModel for quick NLP tasks.
Text classification, NER, sentiment analysis, question answering tasks.""",
        "source": "https://huggingface.co/learn/nlp-course/",
        "metadata": {"title": "Natural language processing", "category": "skill"},
    },
    {
        "content": """Large language models and prompt engineering:
LLMs: GPT, LLaMA, Claude, Gemini — how they work and differ.
Prompt engineering: zero-shot, few-shot, chain-of-thought prompting.
System prompts: setting context and persona for consistent outputs.
Temperature and top-p: controlling randomness vs determinism.
RAG: Retrieval Augmented Generation for grounding LLM responses in facts.
Fine-tuning: LoRA, QLoRA for adapting models to specific tasks cheaply.
LangChain and LlamaIndex for building LLM-powered applications.""",
        "source": "https://www.promptingguide.ai/",
        "metadata": {"title": "LLMs and prompt engineering", "category": "skill"},
    },

    # ─── DATA SCIENCE ─────────────────────────────────────────
    {
        "content": """Data science workflow end to end:
Problem definition: frame business problem as ML/analytics problem.
Data collection: APIs, web scraping, databases, public datasets on Kaggle.
Exploratory Data Analysis: describe(), info(), value_counts(), correlation matrix.
Data cleaning: handling nulls, duplicates, outliers, inconsistent formats.
Feature engineering: creating new features, encoding, scaling, selection.
Modeling: baseline model first, then iterate and improve systematically.
Deployment: Flask/FastAPI API, Docker container, cloud hosting.""",
        "source": "https://kaggle.com/learn",
        "metadata": {"title": "Data science workflow", "category": "skill"},
    },
    {
        "content": """Statistics for data science:
Descriptive statistics: mean, median, mode, variance, standard deviation.
Probability distributions: normal, binomial, Poisson, uniform.
Hypothesis testing: null hypothesis, p-value, t-test, chi-square test.
Confidence intervals and statistical significance explained.
Correlation vs causation: Pearson, Spearman correlation coefficients.
Bayesian thinking: prior, likelihood, posterior, Bayes theorem.
A/B testing: experimental design, sample size, interpreting results.""",
        "source": "https://www.khanacademy.org/math/statistics-probability",
        "metadata": {"title": "Statistics for data science", "category": "skill"},
    },

    # ─── DEVOPS & CLOUD ───────────────────────────────────────
    {
        "content": """Docker fundamentals:
Images vs containers: build once, run anywhere philosophy.
Dockerfile: FROM, RUN, COPY, WORKDIR, EXPOSE, CMD, ENTRYPOINT.
docker build, docker run, docker ps, docker logs, docker exec.
Volumes: persisting data, bind mounts vs named volumes.
Networks: bridge, host, overlay networks for container communication.
Docker Compose: multi-container apps, services, depends_on, environment.
Best practices: small images, non-root user, .dockerignore, multi-stage builds.""",
        "source": "https://docs.docker.com/get-started/",
        "metadata": {"title": "Docker fundamentals", "category": "skill"},
    },
    {
        "content": """CI/CD with GitHub Actions:
Workflows: .github/workflows/*.yml files triggered by events.
Triggers: push, pull_request, schedule, workflow_dispatch.
Jobs and steps: runs-on, uses, run, with, env for configuration.
Actions marketplace: checkout, setup-node, setup-python, docker/build-push.
Secrets: storing API keys, tokens safely in repository settings.
Deployment pipelines: test then build then deploy pattern.
Matrix builds: testing across multiple OS and language versions.""",
        "source": "https://docs.github.com/en/actions",
        "metadata": {"title": "CI/CD with GitHub Actions", "category": "skill"},
    },
    {
        "content": """Cloud platforms overview:
AWS core services: EC2, S3, RDS, Lambda, API Gateway, CloudFront.
Google Cloud: Compute Engine, Cloud Storage, BigQuery, Cloud Run.
Azure: Virtual Machines, Blob Storage, Azure SQL, Azure Functions.
Serverless: Lambda/Cloud Functions for event-driven, pay-per-use computing.
Infrastructure as Code: Terraform, CloudFormation for reproducible infra.
Free tiers: AWS Free Tier, GCP Free Tier, Azure Free Account limits.
Deployment options: VPS (DigitalOcean), PaaS (Render, Railway, Fly.io).""",
        "source": "https://aws.amazon.com/getting-started/",
        "metadata": {"title": "Cloud platforms overview", "category": "skill"},
    },

    # ─── WEB DEVELOPMENT ──────────────────────────────────────
    {
        "content": """HTML and CSS fundamentals:
Semantic HTML: article, section, nav, header, footer, main, aside.
CSS box model: margin, border, padding, content — how they interact.
Flexbox: display:flex, justify-content, align-items, flex-wrap, gap.
CSS Grid: grid-template-columns, grid-area, auto-fill, minmax.
Responsive design: media queries, mobile-first approach, viewport meta.
CSS variables: --primary-color, var(--primary-color) for theming.
Animations: transition, animation, @keyframes, transform properties.""",
        "source": "https://developer.mozilla.org/en-US/docs/Web/CSS",
        "metadata": {"title": "HTML and CSS fundamentals", "category": "skill"},
    },
    {
        "content": """Tailwind CSS practical guide:
Utility-first approach: compose styles from small single-purpose classes.
Layout: flex, grid, container, mx-auto, max-w-* for responsive layouts.
Spacing: p-4, m-2, gap-6, space-x-4 for consistent spacing system.
Typography: text-lg, font-bold, text-gray-600, leading-relaxed.
Colors: bg-indigo-600, text-white, border-gray-200, hover:bg-indigo-700.
Responsive prefixes: sm:, md:, lg:, xl: for breakpoint-specific styles.
Dark mode: dark: prefix, darkMode config in tailwind.config.js.""",
        "source": "https://tailwindcss.com/docs",
        "metadata": {"title": "Tailwind CSS guide", "category": "skill"},
    },
    {
        "content": """FastAPI backend development:
App setup: FastAPI(), uvicorn, automatic OpenAPI docs at /docs.
Path operations: @app.get(), @app.post(), path and query parameters.
Pydantic models: BaseModel for request/response validation and serialization.
Dependency injection: Depends() for auth, DB sessions, shared logic.
Authentication: OAuth2PasswordBearer, JWT tokens, verify tokens.
Background tasks: BackgroundTasks for async operations after response.
CORS: CORSMiddleware for allowing frontend origins to call the API.""",
        "source": "https://fastapi.tiangolo.com/",
        "metadata": {"title": "FastAPI backend development", "category": "skill"},
    },

    # ─── CAREER & JOB HUNTING ─────────────────────────────────
    {
        "content": """Building a strong developer portfolio:
Showcase 3-5 projects with live demos and GitHub repos.
Each project should solve a real problem, not just be a tutorial clone.
Write clear README files: what it does, tech stack, how to run it.
Include screenshots or demo videos for visual impact.
Deploy everything: Vercel for frontend, Render for backend, free tiers exist.
Contribute to open source to show collaboration and code quality.
Write technical blog posts to demonstrate depth of understanding.""",
        "source": "https://github.com",
        "metadata": {"title": "Building a developer portfolio", "category": "general"},
    },
    {
        "content": """Resume writing for software engineers:
One page maximum, clean formatting, ATS-friendly layout.
Strong summary: years of experience, key skills, notable achievement.
Projects section: name, tech stack, 2-3 bullet points with quantified impact.
Skills section: group by category — languages, frameworks, tools, cloud.
Quantify everything: reduced load time by 40%, built for 1000+ users.
Action verbs: built, designed, implemented, optimized, reduced, increased.
Tailor resume for each job: match keywords from job description.""",
        "source": "https://www.levels.fyi/",
        "metadata": {"title": "Resume writing for engineers", "category": "general"},
    },
    {
        "content": """Data structures and algorithms for interviews:
Arrays and strings: two pointers, sliding window, prefix sums.
Linked lists: fast/slow pointers, reversal, cycle detection.
Trees: DFS, BFS, binary search trees, lowest common ancestor.
Graphs: adjacency list, BFS for shortest path, DFS for traversal, union-find.
Dynamic programming: memoization, tabulation, common patterns.
Sorting: quicksort, mergesort, heap sort time/space complexity.
Practice platforms: LeetCode, HackerRank, NeetCode, AlgoExpert.""",
        "source": "https://neetcode.io/",
        "metadata": {"title": "DSA for coding interviews", "category": "general"},
    },
    {
        "content": """System design interview preparation:
Scalability: horizontal vs vertical scaling, load balancers, CDN.
Databases: SQL vs NoSQL trade-offs, sharding, replication, caching.
Caching: Redis, Memcached, cache invalidation strategies, CDN caching.
Message queues: Kafka, RabbitMQ for async processing and decoupling.
Microservices: service decomposition, API gateway, service discovery.
CAP theorem: consistency, availability, partition tolerance trade-offs.
Common designs: URL shortener, Twitter feed, WhatsApp, YouTube, Uber.""",
        "source": "https://github.com/donnemartin/system-design-primer",
        "metadata": {"title": "System design interview prep", "category": "general"},
    },
    {
        "content": """Behavioral interview preparation using STAR method:
Situation: describe the context and background clearly and concisely.
Task: explain your specific responsibility in that situation.
Action: detail the exact steps you took to address the challenge.
Result: quantify the outcome — what improved, what was achieved.
Common questions: tell me about yourself, greatest weakness, conflict resolution.
Leadership stories: times you led a project, mentored someone, made decisions.
Prepare 8-10 stories covering different competencies for flexibility.""",
        "source": "https://www.glassdoor.com/blog/guide/star-method/",
        "metadata": {"title": "Behavioral interview STAR method", "category": "general"},
    },
    {
        "content": """Networking and job search strategy:
LinkedIn optimization: professional photo, strong headline, detailed experience.
Cold outreach: connect with engineers at target companies, personalize messages.
Job boards: LinkedIn Jobs, Indeed, Wellfound, Glassdoor, company career pages.
Referrals: employee referrals dramatically increase interview chances.
Tech meetups: attend local events, conferences, hackathons to network.
Twitter/X: follow engineers, join conversations, build presence in community.
Timing: apply early in job postings, response rates drop after first week.""",
        "source": "https://www.linkedin.com/",
        "metadata": {"title": "Job search and networking", "category": "general"},
    },

    # ─── TOOLS & PRACTICES ────────────────────────────────────
    {
        "content": """Git advanced workflows:
Branching strategies: GitFlow, GitHub Flow, trunk-based development.
Rebase vs merge: rebase for clean history, merge for preserving context.
Interactive rebase: squash commits, reorder, edit messages before pushing.
Cherry-pick: apply specific commits from one branch to another.
Stashing: git stash, git stash pop for temporary work in progress.
Tags: git tag v1.0.0 for release versioning and deployment markers.
Hooks: pre-commit, pre-push for automated linting and testing.""",
        "source": "https://git-scm.com/book/en/v2",
        "metadata": {"title": "Git advanced workflows", "category": "skill"},
    },
    {
        "content": """API design best practices:
RESTful principles: resources as nouns, HTTP methods as verbs.
Status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error.
Versioning: /api/v1/ prefix for backwards compatibility.
Pagination: limit/offset or cursor-based for large datasets.
Authentication: Bearer tokens in Authorization header, not query params.
Documentation: OpenAPI/Swagger spec, clear examples for every endpoint.
Error responses: consistent format with code, message, and details fields.""",
        "source": "https://restfulapi.net/",
        "metadata": {"title": "API design best practices", "category": "skill"},
    },
    {
        "content": """Testing strategies for software:
Unit tests: test individual functions in isolation with mocked dependencies.
Integration tests: test how components work together end to end.
E2E tests: Cypress, Playwright for testing full user flows in browser.
Test-driven development: write failing test first, then implement, then refactor.
Code coverage: aim for 80%+ coverage on critical business logic.
Mocking: unittest.mock, jest.mock for isolating external dependencies.
Performance testing: k6, Locust for load testing APIs under stress.""",
        "source": "https://testingjavascript.com/",
        "metadata": {"title": "Testing strategies", "category": "skill"},
    },
    {
        "content": """Web security fundamentals:
HTTPS: TLS/SSL certificates, Let's Encrypt for free certificates.
Authentication: hashing passwords with bcrypt, never store plaintext.
JWT: structure, signing, verification, expiry, refresh token pattern.
OWASP Top 10: SQL injection, XSS, CSRF, broken authentication risks.
CORS: Cross-Origin Resource Sharing, preflight requests, allowed origins.
Rate limiting: prevent abuse, throttle requests per IP or user.
Environment variables: never commit secrets, use .env files and secret managers.""",
        "source": "https://owasp.org/www-project-top-ten/",
        "metadata": {"title": "Web security fundamentals", "category": "skill"},
    },
    {
        "content": """Software engineering best practices:
Clean code: meaningful names, small functions, single responsibility principle.
SOLID principles: single responsibility, open/closed, Liskov, interface segregation, dependency inversion.
DRY principle: don't repeat yourself, extract reusable functions and modules.
Code reviews: review for correctness, readability, performance, security.
Documentation: README, inline comments for why not what, API docs.
Refactoring: improve code structure without changing external behavior.
Technical debt: identify, track, and systematically pay it down.""",
        "source": "https://refactoring.guru/",
        "metadata": {"title": "Software engineering best practices", "category": "general"},
    },
       # ─── TYPESCRIPT ───────────────────────────────────────────
    {
        "content": """TypeScript fundamentals every developer needs:
Static typing: type annotations for variables, function params, return types.
Basic types: string, number, boolean, null, undefined, any, unknown, never, void.
Interfaces: define object shapes, optional properties with ?, readonly fields.
Type aliases: type Point = { x: number; y: number } for reusable types.
Union types: string | number, discriminated unions for type narrowing.
Generics: function identity<T>(arg: T): T for reusable typed functions.
Enums: enum Direction { Up, Down, Left, Right } for named constants.
Type assertions: value as string, <string>value for manual type narrowing.""",
        "source": "https://www.typescriptlang.org/docs/handbook/intro.html",
        "metadata": {"title": "TypeScript fundamentals", "category": "skill"},
    },
    {
        "content": """TypeScript advanced patterns:
Utility types: Partial<T>, Required<T>, Pick<T,K>, Omit<T,K>, Record<K,V>.
Mapped types: transform every property in a type systematically.
Conditional types: T extends U ? X : Y for type-level logic.
Template literal types: type EventName = `on${Capitalize<string>}`.
Declaration merging: extending interfaces across multiple declarations.
Module augmentation: extending third-party library types safely.
Strict mode: strictNullChecks, noImplicitAny, strictFunctionTypes.
tsconfig.json: target, module, paths, baseUrl, include, exclude options.""",
        "source": "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
        "metadata": {"title": "TypeScript advanced patterns", "category": "skill"},
    },
 
    # ─── SQL ──────────────────────────────────────────────────
    {
        "content": """SQL fundamentals every data professional needs:
SELECT basics: SELECT columns FROM table WHERE condition ORDER BY col LIMIT n.
Filtering: WHERE with =, !=, >, <, BETWEEN, IN, LIKE, IS NULL operators.
Aggregations: COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING.
Joins: INNER JOIN returns matching rows, LEFT JOIN keeps all left rows.
Subqueries: nested SELECT inside WHERE, FROM, or SELECT clause.
String functions: UPPER, LOWER, TRIM, SUBSTRING, CONCAT, REPLACE.
Date functions: NOW(), DATE_TRUNC, EXTRACT, DATE_DIFF for time analysis.
CASE WHEN: conditional logic inside SELECT for derived columns.""",
        "source": "https://mode.com/sql-tutorial/",
        "metadata": {"title": "SQL fundamentals", "category": "skill"},
    },
    {
        "content": """SQL advanced analytics queries:
Window functions: ROW_NUMBER(), RANK(), DENSE_RANK() for row numbering.
LAG and LEAD: compare current row to previous or next row values.
PARTITION BY: apply window function within groups independently.
CTEs: WITH cte AS (...) for readable multi-step query logic.
Recursive CTEs: traverse hierarchical data like org charts, file trees.
PIVOT and UNPIVOT: reshape data from rows to columns and back.
Query optimization: EXPLAIN ANALYZE, index usage, avoiding SELECT *.
Full-text search: tsvector, tsquery, GIN indexes in PostgreSQL.""",
        "source": "https://pgexercises.com/",
        "metadata": {"title": "SQL advanced analytics", "category": "skill"},
    },
 
    # ─── NEXT.JS ──────────────────────────────────────────────
    {
        "content": """Next.js fundamentals:
App Router: file-based routing in the /app directory with layout.tsx.
Pages vs App Router: differences, when to use each, migration path.
Server Components: render on server by default, no useState or useEffect.
Client Components: 'use client' directive for interactive components.
Data fetching: fetch() with cache options, revalidate, no-store.
Loading and error states: loading.tsx, error.tsx for automatic UI.
Metadata API: export metadata object for SEO, og tags, title templates.
Image optimization: next/image with automatic WebP, lazy loading, sizes.""",
        "source": "https://nextjs.org/docs",
        "metadata": {"title": "Next.js fundamentals", "category": "skill"},
    },
    {
        "content": """Next.js deployment and performance:
Static generation: generateStaticParams for dynamic routes at build time.
Server Actions: async functions called directly from forms without API routes.
Route handlers: app/api/route.ts for API endpoints in App Router.
Middleware: middleware.ts for auth, redirects, A/B testing at edge.
Environment variables: .env.local, NEXT_PUBLIC_ prefix for client-side vars.
Vercel deployment: zero-config deploy, preview URLs, edge network.
Performance: Core Web Vitals, Lighthouse scores, font optimization, lazy imports.
ISR: Incremental Static Regeneration with revalidate for fresh static pages.""",
        "source": "https://nextjs.org/docs/app/building-your-application/deploying",
        "metadata": {"title": "Next.js deployment and performance", "category": "skill"},
    },
 
    # ─── DATA ENGINEERING ─────────────────────────────────────
    {
        "content": """Data engineering fundamentals:
ETL vs ELT: extract-transform-load vs modern extract-load-transform pattern.
Data pipelines: batch processing vs streaming, orchestration concepts.
Apache Spark: RDDs, DataFrames, SparkSQL for big data processing.
Apache Airflow: DAGs, operators, sensors, scheduling, XComs for pipelines.
Data warehouses: Snowflake, BigQuery, Redshift — columnar storage advantages.
Data lakes: S3, GCS for raw data storage, Parquet and ORC file formats.
dbt: transform data in warehouse with SQL, tests, documentation, lineage.
Schema evolution: handling changing data structures in production pipelines.""",
        "source": "https://www.databricks.com/glossary/data-engineering",
        "metadata": {"title": "Data engineering fundamentals", "category": "skill"},
    },
    {
        "content": """Apache Kafka and streaming data:
Core concepts: producers, consumers, topics, partitions, offsets.
Consumer groups: parallel processing, each partition consumed by one member.
Retention: time-based and size-based retention for log compaction.
Kafka Streams: stateful stream processing, joins, aggregations, windowing.
Schema Registry: Avro schemas, schema evolution, backward compatibility.
Kafka Connect: source and sink connectors for databases, S3, Elasticsearch.
Real-time use cases: event sourcing, activity tracking, fraud detection.
Kafka vs RabbitMQ: when to use each, throughput vs routing flexibility.""",
        "source": "https://kafka.apache.org/documentation/",
        "metadata": {"title": "Apache Kafka and streaming", "category": "skill"},
    },
 
    # ─── MOBILE DEVELOPMENT ───────────────────────────────────
    {
        "content": """React Native fundamentals:
Core components: View, Text, Image, ScrollView, FlatList, TouchableOpacity.
Styling: StyleSheet.create(), flexbox layout, platform-specific styles.
Navigation: React Navigation library, stack, tab, drawer navigators.
State management: same patterns as React — useState, Context, Redux.
Native APIs: Camera, Location, AsyncStorage, Push Notifications access.
Expo: managed workflow for fast development, OTA updates, EAS Build.
Debugging: Flipper, React DevTools, console.log, breakpoints in Metro.
Performance: FlatList optimization, memo, useCallback, InteractionManager.""",
        "source": "https://reactnative.dev/docs/getting-started",
        "metadata": {"title": "React Native fundamentals", "category": "skill"},
    },
    {
        "content": """Flutter and Dart basics:
Dart language: strongly typed, AOT compiled, null safety, async/await.
Widgets: everything is a widget — StatelessWidget vs StatefulWidget.
Layout widgets: Column, Row, Stack, Container, Expanded, Padding.
State management: setState, Provider, Riverpod, BLoC pattern.
Navigation: Navigator 2.0, GoRouter for declarative routing.
Packages: pub.dev ecosystem, http, dio, shared_preferences, firebase.
Hot reload: instant UI updates during development without restart.
Platform channels: communicate between Dart and native iOS/Android code.""",
        "source": "https://flutter.dev/docs",
        "metadata": {"title": "Flutter and Dart basics", "category": "skill"},
    },
 
    # ─── UI/UX DESIGN ─────────────────────────────────────────
    {
        "content": """UI/UX design fundamentals for developers:
Design thinking: empathize, define, ideate, prototype, test cycle.
User research: interviews, surveys, usability testing, persona creation.
Information architecture: card sorting, sitemaps, navigation patterns.
Wireframing: low-fidelity sketches before high-fidelity mockups.
Color theory: primary/secondary colors, contrast ratios, WCAG accessibility.
Typography: font pairing, hierarchy, line-height, letter-spacing, readability.
Spacing systems: 4px/8px grid, consistent padding, margin patterns.
Figma: frames, components, auto-layout, prototyping, design tokens.""",
        "source": "https://www.nngroup.com/articles/design-thinking/",
        "metadata": {"title": "UI/UX design fundamentals", "category": "skill"},
    },
    {
        "content": """Accessibility and inclusive design:
WCAG guidelines: perceivable, operable, understandable, robust principles.
Color contrast: minimum 4.5:1 ratio for normal text, 3:1 for large text.
Keyboard navigation: focus management, tab order, skip links.
Screen readers: ARIA roles, aria-label, aria-describedby, aria-live.
Semantic HTML: use button not div for interactive elements.
Alt text: describe images meaningfully, empty alt for decorative images.
Focus indicators: never remove outline, style it instead.
Testing: axe DevTools, VoiceOver, NVDA for real accessibility audits.""",
        "source": "https://www.w3.org/WAI/WCAG21/quickref/",
        "metadata": {"title": "Accessibility and inclusive design", "category": "skill"},
    },
 
    # ─── PYTHON WEB FRAMEWORKS ────────────────────────────────
    {
        "content": """Django full-stack web framework:
MTV pattern: Models (ORM), Templates (HTML), Views (business logic).
Models: class-based with Field types, migrations, Meta class, managers.
Admin panel: auto-generated CRUD interface, register models, customize.
URLs: urlpatterns, path(), include(), named URLs, URL namespaces.
Class-based views: ListView, DetailView, CreateView, UpdateView, DeleteView.
Django REST Framework: ModelSerializer, ViewSets, Routers, authentication.
ORM queries: filter(), exclude(), annotate(), select_related(), prefetch_related().
Security: CSRF protection, XSS escaping, SQL injection prevention built-in.""",
        "source": "https://docs.djangoproject.com/en/stable/",
        "metadata": {"title": "Django web framework", "category": "skill"},
    },
    {
        "content": """SQLAlchemy ORM deep dive:
Engine and connection: create_engine(), connection pooling, dialect.
Declarative models: Base, Column, types, relationships, backref.
Session: add(), commit(), rollback(), query(), close() lifecycle.
Relationships: one-to-many, many-to-many with association tables.
Querying: filter(), filter_by(), join(), outerjoin(), subquery().
Lazy vs eager loading: lazy='select', joinedload(), selectinload().
Alembic migrations: alembic init, revision, upgrade, downgrade.
Async SQLAlchemy: AsyncSession, async_engine for FastAPI integration.""",
        "source": "https://docs.sqlalchemy.org/en/20/",
        "metadata": {"title": "SQLAlchemy ORM deep dive", "category": "skill"},
    },
 
    # ─── ALGORITHMS & DSA ─────────────────────────────────────
    {
        "content": """Array and string algorithms:
Two pointers: left/right pointers for palindrome check, pair sums.
Sliding window: fixed and variable size windows for subarray problems.
Prefix sums: precompute cumulative sums for range query in O(1).
Kadane's algorithm: maximum subarray sum in O(n) time.
Binary search: search sorted arrays in O(log n), left/right boundary variants.
Sorting: quicksort O(n log n) average, mergesort O(n log n) stable.
Hashing: use dict/set for O(1) lookups, anagram detection, frequency counts.
Common patterns: frequency map, monotonic stack, next greater element.""",
        "source": "https://neetcode.io/roadmap",
        "metadata": {"title": "Array and string algorithms", "category": "skill"},
    },
    {
        "content": """Tree and graph algorithms:
Binary tree traversal: inorder, preorder, postorder — recursive and iterative.
BFS: queue-based level-order traversal, shortest path in unweighted graph.
DFS: stack/recursion for path finding, cycle detection, topological sort.
Binary search tree: insert, delete, search, validate BST properties.
Lowest common ancestor: recursive approach for binary trees.
Graph representations: adjacency list vs matrix, when to use each.
Dijkstra's algorithm: shortest path in weighted graph with priority queue.
Dynamic programming on trees: tree DP patterns for subtree problems.""",
        "source": "https://cp-algorithms.com/",
        "metadata": {"title": "Tree and graph algorithms", "category": "skill"},
    },
    {
        "content": """Dynamic programming patterns:
Memoization: top-down with cache, recursive with @lru_cache in Python.
Tabulation: bottom-up iterative, build solution from base cases.
1D DP: Fibonacci, climbing stairs, house robber, coin change.
2D DP: longest common subsequence, edit distance, unique paths.
Knapsack: 0/1 knapsack, unbounded knapsack, subset sum variations.
Interval DP: matrix chain multiplication, burst balloons, palindrome partitioning.
State compression: bitmask DP for problems with small set of choices.
Common patterns: recognize overlapping subproblems and optimal substructure.""",
        "source": "https://leetcode.com/discuss/study-guide/1490172/",
        "metadata": {"title": "Dynamic programming patterns", "category": "skill"},
    },
 
    # ─── DEVOPS ADVANCED ──────────────────────────────────────
    {
        "content": """Kubernetes fundamentals:
Pods: smallest deployable unit, one or more containers sharing network.
Deployments: manage pod replicas, rolling updates, rollback strategies.
Services: ClusterIP, NodePort, LoadBalancer for pod networking.
ConfigMaps and Secrets: inject configuration and sensitive data into pods.
Namespaces: isolate resources, RBAC permissions per namespace.
Ingress: HTTP routing rules, TLS termination, path-based routing.
Persistent Volumes: storage abstraction, PVC for stateful applications.
kubectl: apply, get, describe, logs, exec, port-forward essential commands.""",
        "source": "https://kubernetes.io/docs/home/",
        "metadata": {"title": "Kubernetes fundamentals", "category": "skill"},
    },
    {
        "content": """Linux command line for developers:
File operations: ls, cd, pwd, mkdir, rm, cp, mv, touch, find, locate.
Text processing: cat, less, grep, sed, awk, cut, sort, uniq, wc.
Permissions: chmod, chown, chgrp, understanding rwx for user/group/other.
Process management: ps, top, htop, kill, bg, fg, jobs, nohup.
Networking: curl, wget, netstat, ss, ping, traceroute, ssh, scp.
Package managers: apt, yum, brew for installing system packages.
Shell scripting: bash scripts, variables, loops, conditions, functions.
Cron jobs: crontab -e, cron expressions for scheduling tasks.""",
        "source": "https://linuxcommand.org/",
        "metadata": {"title": "Linux command line for developers", "category": "skill"},
    },
 
    # ─── AI / ML ADVANCED ─────────────────────────────────────
    {
        "content": """MLOps and model deployment:
Model serving: FastAPI endpoints, TorchServe, TensorFlow Serving.
Model registry: MLflow, Weights & Biases for experiment tracking.
Feature stores: Feast, Tecton for consistent features train/serve.
Data versioning: DVC for tracking datasets and model artifacts in git.
CI/CD for ML: automated retraining, model validation, shadow deployment.
Monitoring: data drift detection, model performance degradation alerts.
A/B testing models: canary deployments, traffic splitting strategies.
Containerizing ML: Docker images for reproducible model environments.""",
        "source": "https://ml-ops.org/",
        "metadata": {"title": "MLOps and model deployment", "category": "skill"},
    },
    {
        "content": """Vector databases and embeddings:
Embeddings: dense vector representations of text, images, audio.
Similarity search: cosine similarity, dot product, Euclidean distance.
Vector databases: Pinecone, Weaviate, Qdrant, Chroma, pgvector.
Indexing algorithms: HNSW, IVF for approximate nearest neighbor search.
RAG pipeline: chunk text, embed chunks, store in vector DB, retrieve on query.
Embedding models: OpenAI ada-002, sentence-transformers, Cohere embed.
Chunking strategies: fixed size, sentence, semantic, recursive character.
Hybrid search: combine vector similarity with keyword BM25 for better recall.""",
        "source": "https://www.pinecone.io/learn/vector-database/",
        "metadata": {"title": "Vector databases and embeddings", "category": "skill"},
    },
    {
        "content": """Model fine-tuning techniques:
Transfer learning: start from pretrained weights, adapt to new task.
Full fine-tuning: update all parameters, needs large dataset and GPU.
LoRA: Low-Rank Adaptation, train small adapter matrices, very efficient.
QLoRA: quantized LoRA, 4-bit quantization for fine-tuning on consumer GPUs.
PEFT: Parameter-Efficient Fine-Tuning, library for LoRA, prefix tuning.
Instruction tuning: train on instruction-response pairs for chat models.
Dataset preparation: format, deduplication, quality filtering for fine-tuning.
Evaluation: perplexity, BLEU, ROUGE, human eval for generative models.""",
        "source": "https://huggingface.co/docs/peft/index",
        "metadata": {"title": "Model fine-tuning techniques", "category": "skill"},
    },
 
    # ─── CAREER PATHS ─────────────────────────────────────────
    {
        "content": """How to become a frontend developer:
Master HTML, CSS, JavaScript fundamentals before any framework.
Learn React as your primary framework — most job demand globally.
Add TypeScript for type safety — now expected in most frontend roles.
Understand responsive design, accessibility, cross-browser compatibility.
Learn state management: Context API first, then Redux Toolkit or Zustand.
Build 3-5 portfolio projects with real features, not tutorial clones.
Understand performance: Lighthouse, Core Web Vitals, lazy loading.
Job titles: Frontend Developer, UI Engineer, React Developer, Web Developer.""",
        "source": "https://roadmap.sh/frontend",
        "metadata": {"title": "Frontend developer career path", "category": "general"},
    },
    {
        "content": """How to become a backend developer:
Choose one language well: Python (FastAPI/Django) or Node.js (Express).
Understand databases deeply: SQL first, then NoSQL like MongoDB or Redis.
Learn REST API design, authentication (JWT), and authorization patterns.
Understand caching, queuing, and async processing concepts.
Learn Docker for containerization and basic cloud deployment (AWS/GCP/Render).
Version control mastery: Git branching, PR reviews, CI/CD pipelines.
Security: never trust input, hash passwords, use HTTPS, rate limit APIs.
Job titles: Backend Developer, API Engineer, Node.js Developer, Python Developer.""",
        "source": "https://roadmap.sh/backend",
        "metadata": {"title": "Backend developer career path", "category": "general"},
    },
    {
        "content": """How to become a data scientist:
Foundation: Python, statistics, linear algebra, probability theory.
Data tools: Pandas, NumPy, Matplotlib, Seaborn for EDA and visualization.
Machine learning: Scikit-learn for classical ML, understand algorithms deeply.
Deep learning: PyTorch or TensorFlow, CNNs, RNNs, Transformers.
SQL: essential for pulling and transforming data in any data role.
Communication: present findings clearly, translate insights to non-technical stakeholders.
Portfolio: Kaggle competitions, end-to-end projects with deployed models.
Job titles: Data Scientist, ML Engineer, Research Scientist, Applied Scientist.""",
        "source": "https://roadmap.sh/ai-data-scientist",
        "metadata": {"title": "Data scientist career path", "category": "general"},
    },
    {
        "content": """How to become a DevOps / Cloud engineer:
Linux proficiency: command line, bash scripting, process and network management.
Version control: Git, GitHub, branching strategies, code review workflows.
CI/CD: GitHub Actions, Jenkins, GitLab CI for automated build-test-deploy.
Containers: Docker deeply, then Kubernetes for orchestration at scale.
Cloud: pick one platform (AWS recommended), get Solutions Architect Associate cert.
Infrastructure as Code: Terraform for provisioning, Ansible for configuration.
Monitoring: Prometheus, Grafana, ELK stack, Datadog for observability.
Job titles: DevOps Engineer, Platform Engineer, SRE, Cloud Engineer.""",
        "source": "https://roadmap.sh/devops",
        "metadata": {"title": "DevOps engineer career path", "category": "general"},
    },
    {
        "content": """How to become a full stack developer:
Frontend: React + TypeScript + TailwindCSS for modern UI development.
Backend: FastAPI or Express with PostgreSQL and Redis.
Full stack frameworks: Next.js handles both frontend and API routes together.
Database: design schemas, write efficient queries, understand ORMs.
Auth: implement JWT authentication, OAuth with Google/GitHub, session management.
Deployment: Vercel for frontend, Render/Railway for backend, Supabase for DB.
System thinking: understand how all parts connect, debug across the stack.
Job titles: Full Stack Developer, Software Engineer, Web Application Developer.""",
        "source": "https://roadmap.sh/full-stack",
        "metadata": {"title": "Full stack developer career path", "category": "general"},
    },
 
    # ─── PRODUCTIVITY & LEARNING ──────────────────────────────
    {
        "content": """How to learn programming effectively:
Active learning: build projects immediately after learning a concept, not later.
Spaced repetition: review concepts at increasing intervals to retain memory.
Feynman technique: explain concepts in simple terms to expose knowledge gaps.
Deliberate practice: focus on weak areas, not just what you already know.
Time blocking: dedicated 2-hour focused sessions beat scattered 10-minute attempts.
Learning resources: docs > tutorials > YouTube — primary sources are most accurate.
Community: join Discord servers, forums, local meetups for accountability.
Avoid tutorial hell: after basics, build your own projects even if imperfect.""",
        "source": "https://www.scotthyoung.com/blog/ultralearning/",
        "metadata": {"title": "How to learn programming effectively", "category": "general"},
    },
    {
        "content": """Developer productivity tools:
Code editors: VS Code with extensions — Prettier, ESLint, GitLens, Copilot.
Terminal: iTerm2 (Mac) or Windows Terminal, oh-my-zsh, tmux for sessions.
Postman / Hoppscotch: test REST APIs, save collections, environments.
TablePlus / DBeaver: GUI database clients for querying and inspecting data.
Notion / Obsidian: personal knowledge base, project notes, learning journal.
Excalidraw / Miro: diagram architecture, plan systems, whiteboard thinking.
Linear / Jira: issue tracking, kanban boards, sprint planning.
Dotfiles: version control your shell config, aliases, editor settings.""",
        "source": "https://missing.csail.mit.edu/",
        "metadata": {"title": "Developer productivity tools", "category": "general"},
    },
    {
        "content": """Open source contribution guide:
Finding projects: good-first-issue label on GitHub, Up For Grabs website.
Reading codebase: start with README, CONTRIBUTING.md, then explore structure.
Starting small: fix typos, improve docs, add tests before code changes.
Fork and PR workflow: fork repo, create feature branch, push, open pull request.
Writing good PRs: clear title, description of what and why, screenshots if UI.
Code review etiquette: respond to feedback professionally, ask questions.
Building reputation: consistent contributions to one project builds credibility.
Benefits: learn production codebase patterns, network, resume signal.""",
        "source": "https://opensource.guide/how-to-contribute/",
        "metadata": {"title": "Open source contribution guide", "category": "general"},
    },
 
    # ─── WEB3 & EMERGING TECH ─────────────────────────────────
    {
        "content": """Web3 and blockchain basics for developers:
Blockchain: distributed ledger, immutable records, consensus mechanisms.
Ethereum: smart contracts, EVM, gas fees, wallets, transactions.
Solidity: contract structure, state variables, functions, events, modifiers.
Web3.js / Ethers.js: connect frontend to blockchain, read/write contracts.
Wallets: MetaMask integration, connect wallet pattern in dApps.
DeFi concepts: tokens, liquidity pools, staking, yield farming basics.
NFTs: ERC-721 standard, minting, metadata, IPFS for decentralized storage.
Hardhat: local blockchain, deploy scripts, testing smart contracts.""",
        "source": "https://ethereum.org/en/developers/docs/",
        "metadata": {"title": "Web3 and blockchain basics", "category": "skill"},
    },
 
    # ─── INTERVIEW SPECIFIC ───────────────────────────────────
    {
        "content": """Frontend interview preparation:
JavaScript concepts tested: closures, event loop, prototype chain, this keyword.
React concepts: reconciliation, virtual DOM, hooks rules, performance optimization.
CSS layout: flexbox vs grid, specificity, BEM naming, responsive patterns.
Browser: how browsers render pages, critical rendering path, caching.
Network: HTTP/HTTPS, REST vs GraphQL, WebSockets, CORS, status codes.
Accessibility: WCAG, ARIA, semantic HTML tested in senior frontend roles.
Coding tasks: build a component from scratch, fix a bug, optimize performance.
Common questions: explain useEffect, difference between == and ===, event bubbling.""",
        "source": "https://frontendinterviewhandbook.com/",
        "metadata": {"title": "Frontend interview preparation", "category": "general"},
    },
    {
        "content": """Machine learning interview preparation:
Statistics: probability, distributions, hypothesis testing, Bayes theorem.
ML algorithms: explain linear regression, logistic regression, decision trees, SVM.
Deep learning: backpropagation, gradient descent, vanishing gradients, batch norm.
Model evaluation: precision, recall, F1, ROC-AUC, when to use each metric.
Feature engineering: handling missing values, encoding, scaling, selection.
Overfitting: regularization L1/L2, dropout, early stopping, cross-validation.
Case studies: design an ML system, pick the right model for a given problem.
Coding: implement k-means, linear regression, confusion matrix from scratch.""",
        "source": "https://www.interviewquery.com/",
        "metadata": {"title": "Machine learning interview prep", "category": "general"},
    },
    {
        "content": """Data analyst interview preparation:
SQL: window functions, CTEs, complex joins — always tested in every interview.
Excel/Sheets: pivot tables, VLOOKUP, INDEX-MATCH, basic formulas.
Statistics: mean, median, mode, standard deviation, A/B test interpretation.
Python/Pandas: data cleaning, groupby, merge, pivot, describe for EDA.
Data visualization: Tableau, Power BI, or matplotlib/seaborn for presenting data.
Business sense: translating data findings into actionable business recommendations.
Case study questions: given a metric drop, how do you investigate the cause?
Tools tested: SQL most important, then Python or Excel depending on company.""",
        "source": "https://www.datalemur.com/",
        "metadata": {"title": "Data analyst interview prep", "category": "general"},
    },
 
    # ─── SOFT SKILLS ──────────────────────────────────────────
    {
        "content": """Communication skills for software engineers:
Writing: clear commit messages, PR descriptions, technical documentation.
Async communication: Slack messages with enough context, no one-word pings.
Presenting: explain technical concepts to non-technical stakeholders simply.
Asking questions: do research first, then ask with context of what you tried.
Code reviews: give constructive feedback, ask questions instead of demanding.
Estimation: how to give realistic time estimates, communicate delays early.
Meetings: come prepared, take notes, follow up with action items.
Remote work: over-communicate, set availability, document decisions in writing.""",
        "source": "https://www.nonfiction.com/",
        "metadata": {"title": "Communication skills for engineers", "category": "general"},
    },
    {
        "content": """Freelancing as a developer:
Finding clients: Upwork, Toptal, LinkedIn, cold outreach, referrals from network.
Pricing: hourly vs project-based, how to research market rates for your skill.
Proposals: tailor each proposal, show relevant work, solve their stated problem.
Contracts: scope of work, payment terms, revision policy, IP ownership clauses.
Client management: set expectations early, provide weekly updates, get sign-offs.
Invoicing: tools like FreshBooks, Wave, or simple invoice templates.
Taxes: track income and expenses, set aside 25-30% for tax season.
Growing: niche down for higher rates, collect testimonials, build case studies.""",
        "source": "https://www.freelancetowin.com/",
        "metadata": {"title": "Freelancing as a developer", "category": "general"},
    },
]



def main():
    # Check if already seeded — prevent duplicate rows
    existing = supabase.table("knowledge_chunks").select("id").limit(1).execute()
    if existing.data:
        print("⚠️  knowledge_chunks already has data. Skipping ingestion.")
        print("    If you want to re-seed, run this in Supabase SQL Editor first:")
        print("    DELETE FROM knowledge_chunks;")
        return

    print(f"Ingesting {len(DOCUMENTS)} chunks into knowledge_chunks...")
    for i, doc in enumerate(DOCUMENTS):
        try:
            ingest_chunk(
                content=doc["content"],
                source=doc["source"],
                metadata=doc["metadata"],
            )
            print(f"  [{i+1}/{len(DOCUMENTS)}] ✅ {doc['metadata']['title']}")
        except Exception as e:
            print(f"  [{i+1}/{len(DOCUMENTS)}] ❌ Failed: {e}")

    print(f"\n✅ Done! {len(DOCUMENTS)} chunks seeded into knowledge_chunks.")


if __name__ == "__main__":
    main()