--
-- PostgreSQL database dump
--

\restrict wrFtscxtuov0Z2KNHiFe7bpvhA5WKFYsmKozcwk1vYIzgWRsbmI1NaV1C4tiZwi

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: ramais_user
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO ramais_user;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: ramais_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO ramais_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: ramais_user
--

COMMENT ON SCHEMA public IS '';


--
-- Name: SolicitacaoRecurso; Type: TYPE; Schema: public; Owner: ramais_user
--

CREATE TYPE public."SolicitacaoRecurso" AS ENUM (
    'RECADO',
    'NOTICIA'
);


ALTER TYPE public."SolicitacaoRecurso" OWNER TO ramais_user;

--
-- Name: SolicitacaoStatus; Type: TYPE; Schema: public; Owner: ramais_user
--

CREATE TYPE public."SolicitacaoStatus" AS ENUM (
    'PENDENTE',
    'APROVADO',
    'RECUSADO',
    'CANCELADO'
);


ALTER TYPE public."SolicitacaoStatus" OWNER TO ramais_user;

--
-- Name: SolicitacaoTipo; Type: TYPE; Schema: public; Owner: ramais_user
--

CREATE TYPE public."SolicitacaoTipo" AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE'
);


ALTER TYPE public."SolicitacaoTipo" OWNER TO ramais_user;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: ramais_user
--

CREATE TYPE public."UserRole" AS ENUM (
    'OWNER',
    'ADMIN',
    'MESSAGEONLY',
    'NEWSONLY',
    'MESSAGENEWS',
    'EVENTS'
);


ALTER TYPE public."UserRole" OWNER TO ramais_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: ramais_user
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO ramais_user;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: ramais_user
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO ramais_user;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: ramais_user
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO ramais_user;

--
-- Name: account; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.account (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    scope text,
    password text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.account OWNER TO ramais_user;

--
-- Name: agenda_eventos; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.agenda_eventos (
    id integer NOT NULL,
    titulo text NOT NULL,
    descricao text,
    data timestamp(3) without time zone NOT NULL,
    "unidadeId" integer NOT NULL,
    "criadoPorId" text NOT NULL,
    "atualizadoPorId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.agenda_eventos OWNER TO ramais_user;

--
-- Name: agenda_eventos_audits; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.agenda_eventos_audits (
    id integer NOT NULL,
    "eventoId" integer NOT NULL,
    "userId" text NOT NULL,
    "userNome" text NOT NULL,
    acao text NOT NULL,
    "dadosAntigos" jsonb,
    "dadosNovos" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "eventoTitulo" text NOT NULL,
    "unidadeId" integer NOT NULL,
    "unidadeNome" text
);


ALTER TABLE public.agenda_eventos_audits OWNER TO ramais_user;

--
-- Name: agenda_eventos_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.agenda_eventos_audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agenda_eventos_audits_id_seq OWNER TO ramais_user;

--
-- Name: agenda_eventos_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.agenda_eventos_audits_id_seq OWNED BY public.agenda_eventos_audits.id;


--
-- Name: agenda_eventos_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.agenda_eventos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agenda_eventos_id_seq OWNER TO ramais_user;

--
-- Name: agenda_eventos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.agenda_eventos_id_seq OWNED BY public.agenda_eventos.id;


--
-- Name: emails; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.emails (
    id integer NOT NULL,
    email text NOT NULL,
    nome text,
    setor text NOT NULL,
    "unidadeId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.emails OWNER TO ramais_user;

--
-- Name: emails_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.emails_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emails_id_seq OWNER TO ramais_user;

--
-- Name: emails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.emails_id_seq OWNED BY public.emails.id;


--
-- Name: jornais; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.jornais (
    id integer NOT NULL,
    titulo text NOT NULL,
    descricao text NOT NULL,
    imagem text NOT NULL,
    url text NOT NULL,
    "dataLancamento" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.jornais OWNER TO ramais_user;

--
-- Name: jornais_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.jornais_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jornais_id_seq OWNER TO ramais_user;

--
-- Name: jornais_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.jornais_id_seq OWNED BY public.jornais.id;


--
-- Name: noticias; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.noticias (
    id integer NOT NULL,
    titulo text NOT NULL,
    conteudo text NOT NULL,
    imagem text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.noticias OWNER TO ramais_user;

--
-- Name: noticias_audits; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.noticias_audits (
    id integer NOT NULL,
    "noticiaId" integer NOT NULL,
    "userId" text NOT NULL,
    "userNome" text NOT NULL,
    acao text NOT NULL,
    "dadosAntigos" jsonb,
    "dadosNovos" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.noticias_audits OWNER TO ramais_user;

--
-- Name: noticias_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.noticias_audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.noticias_audits_id_seq OWNER TO ramais_user;

--
-- Name: noticias_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.noticias_audits_id_seq OWNED BY public.noticias_audits.id;


--
-- Name: noticias_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.noticias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.noticias_id_seq OWNER TO ramais_user;

--
-- Name: noticias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.noticias_id_seq OWNED BY public.noticias.id;


--
-- Name: ramais; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.ramais (
    id integer NOT NULL,
    numero text NOT NULL,
    nome text,
    setor text NOT NULL,
    "unidadeId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.ramais OWNER TO ramais_user;

--
-- Name: ramais_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.ramais_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ramais_id_seq OWNER TO ramais_user;

--
-- Name: ramais_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.ramais_id_seq OWNED BY public.ramais.id;


--
-- Name: recados; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.recados (
    id integer NOT NULL,
    titulo text NOT NULL,
    conteudo text NOT NULL,
    imagem text,
    "unidadeId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.recados OWNER TO ramais_user;

--
-- Name: recados_audits; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.recados_audits (
    id integer NOT NULL,
    "recadoId" integer NOT NULL,
    "userId" text NOT NULL,
    "userNome" text NOT NULL,
    acao text NOT NULL,
    "dadosAntigos" jsonb,
    "dadosNovos" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.recados_audits OWNER TO ramais_user;

--
-- Name: recados_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.recados_audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recados_audits_id_seq OWNER TO ramais_user;

--
-- Name: recados_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.recados_audits_id_seq OWNED BY public.recados_audits.id;


--
-- Name: recados_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.recados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recados_id_seq OWNER TO ramais_user;

--
-- Name: recados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.recados_id_seq OWNED BY public.recados.id;


--
-- Name: recados_unidades; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.recados_unidades (
    id integer NOT NULL,
    "recadoId" integer NOT NULL,
    "unidadeId" integer NOT NULL
);


ALTER TABLE public.recados_unidades OWNER TO ramais_user;

--
-- Name: recados_unidades_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.recados_unidades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recados_unidades_id_seq OWNER TO ramais_user;

--
-- Name: recados_unidades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.recados_unidades_id_seq OWNED BY public.recados_unidades.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.session (
    id text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL
);


ALTER TABLE public.session OWNER TO ramais_user;

--
-- Name: solicitacoes_gerenciamento; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.solicitacoes_gerenciamento (
    id integer NOT NULL,
    recurso public."SolicitacaoRecurso" NOT NULL,
    tipo public."SolicitacaoTipo" NOT NULL,
    status public."SolicitacaoStatus" DEFAULT 'PENDENTE'::public."SolicitacaoStatus" NOT NULL,
    "recadoId" integer,
    "noticiaId" integer,
    "unidadeId" integer,
    "unidadeIds" text,
    titulo text,
    conteudo text,
    imagem text,
    "imagemAntiga" text,
    "motivoRecusa" text,
    "solicitanteId" text NOT NULL,
    "solicitanteNome" text NOT NULL,
    "revisorId" text,
    "revisorNome" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.solicitacoes_gerenciamento OWNER TO ramais_user;

--
-- Name: solicitacoes_gerenciamento_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.solicitacoes_gerenciamento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitacoes_gerenciamento_id_seq OWNER TO ramais_user;

--
-- Name: solicitacoes_gerenciamento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.solicitacoes_gerenciamento_id_seq OWNED BY public.solicitacoes_gerenciamento.id;


--
-- Name: unidades; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.unidades (
    id integer NOT NULL,
    nome text NOT NULL
);


ALTER TABLE public.unidades OWNER TO ramais_user;

--
-- Name: unidades_id_seq; Type: SEQUENCE; Schema: public; Owner: ramais_user
--

CREATE SEQUENCE public.unidades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unidades_id_seq OWNER TO ramais_user;

--
-- Name: unidades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ramais_user
--

ALTER SEQUENCE public.unidades_id_seq OWNED BY public.unidades.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "unidadeId" integer,
    role public."UserRole" DEFAULT 'ADMIN'::public."UserRole" NOT NULL
);


ALTER TABLE public."user" OWNER TO ramais_user;

--
-- Name: verification; Type: TABLE; Schema: public; Owner: ramais_user
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verification OWNER TO ramais_user;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: ramais_user
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: agenda_eventos id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.agenda_eventos ALTER COLUMN id SET DEFAULT nextval('public.agenda_eventos_id_seq'::regclass);


--
-- Name: agenda_eventos_audits id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.agenda_eventos_audits ALTER COLUMN id SET DEFAULT nextval('public.agenda_eventos_audits_id_seq'::regclass);


--
-- Name: emails id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.emails ALTER COLUMN id SET DEFAULT nextval('public.emails_id_seq'::regclass);


--
-- Name: jornais id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.jornais ALTER COLUMN id SET DEFAULT nextval('public.jornais_id_seq'::regclass);


--
-- Name: noticias id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.noticias ALTER COLUMN id SET DEFAULT nextval('public.noticias_id_seq'::regclass);


--
-- Name: noticias_audits id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.noticias_audits ALTER COLUMN id SET DEFAULT nextval('public.noticias_audits_id_seq'::regclass);


--
-- Name: ramais id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.ramais ALTER COLUMN id SET DEFAULT nextval('public.ramais_id_seq'::regclass);


--
-- Name: recados id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.recados ALTER COLUMN id SET DEFAULT nextval('public.recados_id_seq'::regclass);


--
-- Name: recados_audits id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.recados_audits ALTER COLUMN id SET DEFAULT nextval('public.recados_audits_id_seq'::regclass);


--
-- Name: recados_unidades id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.recados_unidades ALTER COLUMN id SET DEFAULT nextval('public.recados_unidades_id_seq'::regclass);


--
-- Name: solicitacoes_gerenciamento id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.solicitacoes_gerenciamento ALTER COLUMN id SET DEFAULT nextval('public.solicitacoes_gerenciamento_id_seq'::regclass);


--
-- Name: unidades id; Type: DEFAULT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.unidades ALTER COLUMN id SET DEFAULT nextval('public.unidades_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: ramais_user
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	268fe12b4577cf1db73ced3538b8689512183eae8b2779816ce773202a8315fb	1767362226170
2	268fe12b4577cf1db73ced3538b8689512183eae8b2779816ce773202a8315fb	1767369520360
3	d2d563e78d4e41657c1edbb694551422d516d9d3822c8a1ae6773e972644da24	1767381424503
4	56442580c7c1ae08411a137ec22765550c1efb5b1d05f4479efb4bcf38c227cb	1767381701569
5	7eebf9ee37e812c6529d1b0fa7d37483279cc6723f4686e387032acfef5e0a5c	1767381866576
6	1dab18e7416980f1b1953d84031ab44b8e914bbd7f10f7b112d7e53af26020e2	1767383644285
7	8dce98ce282b920aebc4c0e40d6434585414778812693fe188a6a9dcd1fc2f41	1767384159159
8	a79bb763fc656f4e884432f7bae160d4af317c63430b5a5325b990bb5ee463df	1767384779048
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9819973a-a163-4c0f-8a06-5e0f51b9b244	ada1e6c21e6d266b5e4a8971a5f42046900666727c5f183b11fad6e5ce8d454c	2026-07-27 15:13:45.476599-04	0_init	\N	\N	2026-07-27 15:13:45.379048-04	1
bd69472b-cb1f-47f2-8145-396372c4cc04	1e614e742e9e37f8448aac5c5cecd23730f12276f6317ba9c31f8b6bd03aaab3	2026-07-27 15:13:45.486386-04	20260727133640_add_solicitacao_recados	\N	\N	2026-07-27 15:13:45.477093-04	1
30ca341b-a153-45cd-80b4-a4ea8e744a03	1e4c6e93303dc68654be8e687a3a9305ec66ac78f34a99e950e355aace411789	2026-07-27 15:13:45.496198-04	20260727134955_add_solicitacao_gerenciamento	\N	\N	2026-07-27 15:13:45.486755-04	1
13f8ae9e-596f-42cf-b473-89d9e6b4662f	8f3b5461e856b343ad527369203ee61ef3d0936929624f5228e4c550b43a3bf8	2026-07-27 15:14:23.420329-04	20260727191423_add_log_agenda	\N	\N	2026-07-27 15:14:23.413974-04	1
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
cQfMWQ8eHOsT8Ji2R8A4lcV16oVQKaih	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	credential	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	\N	\N	\N	\N	\N	\N	29424b8072eee536276d62e605564abc:5c2c46459a57029417d4d2873fdcef4e628d557739632c0123b5027cdd6821897a82f207ccc481caba44d79cdbba5320fce7c5b0eea4a029a244de58468b2518	2026-07-27 19:18:55.564	2026-07-27 19:18:55.564
CO0F4BIa1ZItJfuEJ9cUWMB5laUi9pYp	Gd7xjIszz3Op3fj32MQKZUFsE3ORPPr3	credential	Gd7xjIszz3Op3fj32MQKZUFsE3ORPPr3	\N	\N	\N	\N	\N	\N	fb0d74fd4cdbad8988006f7b38cf7de3:209952664f75f40eaac98f2b403574811cfe4e06cafb53354c986049721686728d855860a38ab018f9512797875c2d37e62cdf7f7ee079ecef9fb8fb4b1a14c5	2026-07-27 19:21:40.982	2026-07-27 19:21:40.982
cnSWxRRH5ebRN1nkdwZy94xxQbfcGvJU	ZK1KfY2i8AO7xoaEUuvyGTjs8FJl2KUF	credential	ZK1KfY2i8AO7xoaEUuvyGTjs8FJl2KUF	\N	\N	\N	\N	\N	\N	936d81109b09103c76be88163038916d:5ab1ee0b6c0d5c1cb73fe5b50968518f186ba1d828d3ef88f3ab5a1cd831ba4711f352fbd534bae69852771f3b3f09b58ed118d8904e4a444c27ddb15b13ea77	2026-07-27 19:22:16.827	2026-07-27 19:22:16.827
GSHQw8WBPlNC6ZPyOEjEflE8AtGmCWgN	jYTB4si2DYTYEfHj3cjSEcv54XbfmcWn	credential	jYTB4si2DYTYEfHj3cjSEcv54XbfmcWn	\N	\N	\N	\N	\N	\N	66d60752c710e38935393f73de0d4eed:296e8d0a5d34686a6a7d489b38be7d0a0ab60a942afa25ce51a57ef375f302ec9962cd5977c88d730321959e82b309f3f950394e1a56a3cfeefdafa0ddfe2f4d	2026-07-27 19:22:43.922	2026-07-27 19:22:43.922
ODnKkIoJE9D2TZo7At8ZvPk1mHwaZCJu	0friVJHkFU7RrXu19SRmxHcCvB46cBZe	credential	0friVJHkFU7RrXu19SRmxHcCvB46cBZe	\N	\N	\N	\N	\N	\N	0069b24edc403a7e580c18107f836c55:bd3302c302de8b819a22171970fbf31ff4a84814923f525ad8f4a1ab27b265dc4696ea42ba1cd8edf36acf6f78c846c7255136736eecae4d2a4822191b08c774	2026-07-27 19:23:24.269	2026-07-27 19:23:24.269
PgAFdglBgsbev4eMlpdazcvtSJZ7jl6z	W4JSqLp9WdqyASjepXwwDldzEO9xFjxC	credential	W4JSqLp9WdqyASjepXwwDldzEO9xFjxC	\N	\N	\N	\N	\N	\N	0e6ab1c01cec5ab643afbfe2e3f3c6eb:acdaa49031d60415df6b53347ff6ea5097d1f45de5c205adf217fe7dcc25252ff947bc440d7cbb06d9644e3b674fd3454b4418d819e341fc4392dae49f999e03	2026-07-27 19:23:59.008	2026-07-27 19:23:59.008
\.


--
-- Data for Name: agenda_eventos; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.agenda_eventos (id, titulo, descricao, data, "unidadeId", "criadoPorId", "atualizadoPorId", "createdAt", "updatedAt") FROM stdin;
4	safsdfasdf	asffdasfdaf	2026-07-29 12:00:00	3	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	\N	2026-07-29 12:15:18.111	2026-07-29 12:15:18.111
5	aasdfasdfsfsadfasdfasdf	fasdfasdffasdfasdfsa	2026-07-29 16:00:00	3	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	2026-07-29 12:27:29.835	2026-07-29 12:27:48.445
\.


--
-- Data for Name: agenda_eventos_audits; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.agenda_eventos_audits (id, "eventoId", "userId", "userNome", acao, "dadosAntigos", "dadosNovos", "createdAt", "eventoTitulo", "unidadeId", "unidadeNome") FROM stdin;
1	2	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	admin	CREATE	\N	{"data": "2026-07-29T12:00:00.000Z", "titulo": "a", "descricao": "a", "unidadeId": 3}	2026-07-29 12:07:34.735	a	3	Barra do Bugres-MT
2	3	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	admin	CREATE	\N	{"data": "2026-07-29T12:00:00.000Z", "titulo": "a", "descricao": "asdfsdf", "unidadeId": 3}	2026-07-29 12:08:28.456	a	3	Barra do Bugres-MT
3	1	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	admin	DELETE	{"data": "2026-07-14T12:00:00.000Z", "titulo": "a", "descricao": "a", "unidadeId": 3}	\N	2026-07-29 12:14:27.39	a	3	Barra do Bugres-MT
4	3	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	admin	UPDATE	{"data": "2026-07-29T12:00:00.000Z", "titulo": "a", "descricao": "asdfsdf", "unidadeId": 3}	{"data": "2026-07-29T16:00:00.000Z", "titulo": "afasdfsadf", "descricao": "asdfsdf", "unidadeId": 3}	2026-07-29 12:14:56.007	afasdfsadf	3	Barra do Bugres-MT
5	3	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	admin	DELETE	{"data": "2026-07-29T16:00:00.000Z", "titulo": "afasdfsadf", "descricao": "asdfsdf", "unidadeId": 3}	\N	2026-07-29 12:15:08.188	afasdfsadf	3	Barra do Bugres-MT
6	2	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	admin	DELETE	{"data": "2026-07-29T16:00:00.000Z", "titulo": "aafdsfasdf", "descricao": "a", "unidadeId": 3}	\N	2026-07-29 12:15:11.675	aafdsfasdf	3	Barra do Bugres-MT
7	4	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	admin	CREATE	\N	{"data": "2026-07-29T12:00:00.000Z", "titulo": "safsdfasdf", "descricao": "asffdasfdaf", "unidadeId": 3}	2026-07-29 12:15:18.117	safsdfasdf	3	Barra do Bugres-MT
8	5	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	admin	CREATE	\N	{"data": "2026-07-29T12:00:00.000Z", "titulo": "aasdfasdfs", "descricao": "fasdfasdf", "unidadeId": 3}	2026-07-29 12:27:29.844	aasdfasdfs	3	Barra do Bugres-MT
9	5	SIgEXSfPRaoug2S77YorCrLsgWiWizmd	admin	UPDATE	{"data": "2026-07-29T12:00:00.000Z", "titulo": "aasdfasdfs", "descricao": "fasdfasdf", "unidadeId": 3}	{"data": "2026-07-29T16:00:00.000Z", "titulo": "aasdfasdfsfsadfasdfasdf", "descricao": "fasdfasdffasdfasdfsa", "unidadeId": 3}	2026-07-29 12:27:48.451	aasdfasdfsfsadfasdfasdf	3	Barra do Bugres-MT
\.


--
-- Data for Name: emails; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.emails (id, email, nome, setor, "unidadeId", "createdAt", "updatedAt") FROM stdin;
1	ana.silva@empresa.com	Ana Silva	RH	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
2	bruno.costa@empresa.com	Bruno Costa	TI	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
3	carla.souza@empresa.com	Carla Souza	Financeiro	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
4	diego.lima@empresa.com	Diego Lima	Vendas	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
5	elena.martins@empresa.com	Elena Martins	Marketing	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
6	fabio.gomes@empresa.com	Fabio Gomes	RH	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
7	gabriela.ferraz@empresa.com	Gabriela Ferraz	TI	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
8	helio.santos@empresa.com	Helio Santos	Financeiro	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
9	isabela.rocha@empresa.com	Isabela Rocha	Vendas	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
10	joao.mendes@empresa.com	Joao Mendes	Marketing	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
11	karen.oliveira@empresa.com	Karen Oliveira	RH	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
12	lucas.pereira@empresa.com	Lucas Pereira	TI	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
13	marina.alves@empresa.com	Marina Alves	Financeiro	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
14	nelson.dias@empresa.com	Nelson Dias	Vendas	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
15	olivia.ribeiro@empresa.com	Olivia Ribeiro	Marketing	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
16	paulo.vieira@empresa.com	Paulo Vieira	RH	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
17	quenia.lopes@empresa.com	Quenia Lopes	TI	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
18	ricardo.nunes@empresa.com	Ricardo Nunes	Financeiro	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
19	sandra.melo@empresa.com	Sandra Melo	Vendas	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
20	thiago.cardoso@empresa.com	Thiago Cardoso	Marketing	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
\.


--
-- Data for Name: jornais; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.jornais (id, titulo, descricao, imagem, url, "dataLancamento", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: noticias; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.noticias (id, titulo, conteudo, imagem, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: noticias_audits; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.noticias_audits (id, "noticiaId", "userId", "userNome", acao, "dadosAntigos", "dadosNovos", "createdAt") FROM stdin;
\.


--
-- Data for Name: ramais; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.ramais (id, numero, nome, setor, "unidadeId", "createdAt", "updatedAt") FROM stdin;
1	1000	Recepção Adm	Recepção	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
2	1011	Erasmo Nogueira	Escritório	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
3	1020	Heitor Pio	Almoxarifado	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
4	1021	Beatriz Silva	Almoxarifado	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
5	1022	Cindiel Ortiz	Almoxarifado	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
6	1023	Atendimento Balcão	Almoxarifado	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
7	1090	Leandro Ribeiro	Acerto de Gado	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
8	1091	Christtiano Marchetti	Acerto de Gado	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
9	1060	Matheus Bolzan	Exportação	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
10	1061	João Oliveira	Exportação	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
11	1062	Gustavo Gomes	Exportação	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
12	1070	Fabio Bolzan	Comercial	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
13	1071	Angelo Santos	Comercial	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
14	1080	Cicero Filho	Compra Almoxarifado	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
15	1120	Lucilene Martins	Fiscal	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
16	1121	Ana Anjos	Fiscal	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
17	1122	Paulo Alves	Fiscal	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
18	1010	Denis Volpi	Gerencial	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
19	1500	Osni Walter	Gerencial	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
20	1580	Amauri Nunes	Gerencial	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
21	1210	Leonardo Santos	Financeiro	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
22	1211	Gisele Franco	Financeiro	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
23	1040	Angela Santos	Contas a Pagar	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
24	1180	Sergio Capuci	Diretoria	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
25	1200	Wellington Larreia	Faturamento Saída	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
26	1201	Gabriel Oliveira	Faturamento Saída	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
27	1202	Lauany Costa	Faturamento Saída	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
28	1190	Caique Franco	Faturamento de Entrada	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
29	1240	Vinicius Martins	PCP	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
30	1241	Woshington Gonçalves	PCP	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
31	1280	Leiriane Sousa	Psicologia	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
32	1300	Roni Dallazem	RH	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
33	1301	Juliari Medeiros	RH	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
34	1302	Daiane Gonçalves	RH	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
35	1303	Raul Gomes	RH	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
36	1304	Estagiario RH	RH	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
37	1306	Ingles Santos	RH	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
38	1930	Alcilene Nunes	Assistência Social	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
39	1310	Sala de reunião ADM	Sala de Reunião	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
40	1311	Sala de Treinamento	Sala de Reunião	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
41	1330	TI Geral	TI	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
42	1331	Guímel Batista	TI	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
43	1332	Marcos Gonçalves	TI	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
44	1339	Cleison Souza	TI	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
45	1400	Portaria	Portaria	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
46	1510	\N	PCM	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
47	1560	Neiza Donatoni	Refeitório	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
48	1581	Amauri Nunes	Manutenção	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
49	1590	Edinei Schipanski	Elétrica	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
50	1940	\N	Berçario	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
51	1980	\N	Motoristas Dormitório	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
52	1600	Thayna Oliveira	Garantia da Qualidade	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
53	1601	G.Q - Monitores	Garantia da Qualidade	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
54	1602	Garantia da Qualidade	Garantia da Qualidade	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
55	1603	Sup Garantia	Garantia da Qualidade	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
56	1610	Emabalagem Secundária	Embalagem Secundária - Desossa	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
57	1640	Embalagem Mezanino	Embalagem Secundária - Desossa	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
58	1641	Estoque Embalagem	Embalagem Secundária - Desossa	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
59	1620	Expedição de caixas	Embarque	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
60	1621	Tendal Pendurado	Embarque	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
61	1742	Corte/PH	Embarque	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
62	1630	Sala de Etiquetas	Sala de Etiqueta	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
63	1650	Lavanderia	Lavanderia	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
64	1850	Sala de Químicos	Químicos	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
65	1670	Halal	Halal	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
66	1501	\N	Sala dos Encarregados	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
67	1690	Instrumentação	Instrumentação	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
68	1720	Analista Abate	Abate	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
69	1721	Balança Abate	Abate	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
70	1700	\N	Curral	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
71	1730	Analista Desossa	Desossa	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
72	1740	Leonardo Maas	Rastreabilidade	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
73	1741	Rastreabilidade Insumos	Rastreabilidade	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
74	1750	Sala de Maquinas	Sala de Máquina	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
75	1760	Sala de Etiquetas	Miúdos	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
76	1761	Balança Secundaria	Miúdos	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
77	1780	Ademilson Rodrigues	Transporte	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
78	1781	Alequessandro Souza	Transporte	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
79	1790	Romario - Frete Boiadeiro	Transporte Boiadeiro	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
80	1800	Escritório	SIF	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
81	1801	Paulo Hiane	SIF	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
82	1802	Igor	SIF	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
83	1803	Daniela	SIF	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
84	1900	Rosano Freitas	Segurança do Trabalho	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
85	1901	Segurança do Trabalho	Segurança do Trabalho	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
86	1910	Enfermaria	Medicina/Enfermaria	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
87	1920	Dayana Graças	Fisioterapia	1	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
88	2000	Nilva	Telefonista	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
89	2010	Evandro Félix	Gerente ADM	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
90	2020	\N	Almoxarifado Balcão	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
91	2021	Jhonatan/Viviane	Almoxarifado NF	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
92	2022	Marli	Almoxarifado	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
93	2070	Vitor/Kalissia	Conferencia	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
94	2071	Leandro	Comercial Interno	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
95	2072	Ricardo	Comercial Interno	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
96	2090	Edivan	Compra de Gado	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
97	2091	Romenir	Compra de Gado	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
98	2120	Lucineia	Fiscal	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
99	2121	Luciano	Fiscal	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
100	2170	Michel	Devolução	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
101	2180	Clarindo Capuci	Diretoria	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
102	2181	Irene Capuci	Diretoria	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
103	2182	Osmar Capuci	Diretoria	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
104	2190	Flavio/Cristian	Faturamento Entrada	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
105	2200	Andre/João	Faturamento Saída	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
106	2201	Fabricio	Faturamento Saída	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
107	2210	Lucilene/Salete	Financeiro	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
108	2240	Danilo	PCP	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
109	2241	Caique/Antonio	PCP	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
110	2250	James/Wilson	P&D	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
111	2280	Izabelle	Psicologia	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
112	2300	Alan	RH	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
113	2301	Pedro/Vanessa	RH	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
114	2310	\N	Sala Reunião / Treinamentos / Auditório	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
115	2330	Nova Andradina	TI	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
116	2331	Hilderson	TI	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
117	2332	Kaue	TI	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
118	2333	William	TI	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
119	2400	\N	Portaria 2400	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
120	2500	Luiz Fernando	Gerente Industrial	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
121	2510	Paola/Carol	PCM	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
122	2511	Daniel	PCM	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
123	2560	Ariane	Nutricionista	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
124	2561	\N	Cozinha / Refeitório	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
125	2600	Pamela	Coord. G.Q	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
126	2601	\N	Garantia da Qualidade	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
127	2620	Andre/Sergio	Embarque A	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
128	2621	Rafael	Embarque Caixaria	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
129	2650	\N	Lavanderia	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
130	2660	\N	Graxaria	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
131	2670	\N	Halal	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
132	2700	\N	Curral	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
133	2720	Aurilei	Abate	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
134	2721	DIF	Abate	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
135	2722	Apontadora	Abate	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
136	2730	Bruna	Desossa	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
137	2731	Luiz Sobral	Desossa	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
138	2732	\N	Desossa Dianteiro	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
139	2740	\N	Rastreabilidade	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
140	2750	Givaldo	Sala de Máquinas	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
141	2760	\N	Miúdos	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
142	2780	Weverton	Transporte	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
143	2781	Kauã/Danillo	Transporte	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
144	2800	\N	SIF	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
145	2801	Marcos	SIF	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
146	2900	\N	Segurança do Trabalho 2900	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
147	2910	\N	Medicina / Enfermaria	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
148	2920	\N	Fisioterapia	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
149	2950	\N	Alojamento	2	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
150	3000	Karin	Telefonista – Adm	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
151	3001	Karin	Telefonista – Adm	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
152	3010	Sr. Geiser	Adm Gerente	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
153	3020	Gisele	Almox	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
154	3040	Carla	Adm Conferência	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
155	3060	Marcelo	Adm Exportação	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
156	3061	Rodolfo	Adm Exportação	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
157	3070	Elias	Adm Vendas	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
158	3080	Patricia	Compras – Almoxarifado	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
159	3090	Maurício	Adm Compras de Bovino	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
160	3091	Ricardo	Adm Compras de Bovino	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
161	3120	Fernandes	Adm Escrita Fiscal	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
162	3121	Micaelle	Adm Escrita Fiscal	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
163	3180	Sr. Osmar	Adm Diretoria	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
164	3181	D. Rosângela	Adm Diretoria	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
165	3190	Ângela	Adm Fat. Entrada	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
166	3200	Adeleoner	Adm Faturista	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
167	3210	Allan	Adm Financeiro	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
168	3240	Josimar	Adm PCP	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
169	3280	Adriana	Psc. – RH	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
170	3300	Carlos	RH	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
171	3301	Bruna	RH	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
172	3302	Keven	RH	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
173	3320	Leonardo	Adm Sustentabilidade	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
174	3321	Moacir	Adm Sustentabilidade	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
175	3330	Silvio	Adm TI	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
176	3331	Gustavo	Suporte/TI	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
177	3400	\N	Portaria	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
178	3500	Sr. Silmair	Gerente Industrial	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
179	3510	Mylleni	PCM	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
180	3511	Marcio	Coor. de Manut. - PCM	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
181	3560	Tatiana	Nutrição	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
182	3600	\N	Garantia da Qualidade	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
183	3601	Roberta/Thamires	GQ	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
184	3610	\N	Embalagem Secundária - Ind	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
185	3620	\N	Tendal - Ind	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
186	3621	\N	Embarque de Caixa - Ind	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
187	3640	Josmiro	Estoque de Embalagem	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
188	3660	\N	Graxaria - Ind	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
189	3690	Wilson	Instrumentação	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
190	3700	\N	Curral - Ind	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
191	3720	\N	Abate - Balança – Ind	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
192	3721	\N	Abate - Rastreabilidade – Ind	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
193	3730	\N	Desossa - Ind	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
194	3750	\N	Sala de Maquinas - Ind	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
195	3760	\N	Miudos - Balança – Ind	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
196	3761	\N	Miudos Sala de Higienização - Ind	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
197	3780	Enc. Tran.	Transporte Frot Int	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
198	3790	Marcos	Adm Trans Boiadeiro	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
199	3800	Hemily	SIF Secretária	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
200	3801	Rafaelli	SIF	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
201	3802	\N	SIF - AFFA	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
202	3803	\N	SIF - AFFA	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
203	3900	Israel	SESMT Seg do Trabalho	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
204	3910	Keila	Ambulatório	3	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
205	4000	Josie Belem	Recepção Adm	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
206	4010	Bruno Puro	Remessa	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
207	4011	Cristiano Garcia	Controladoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
208	4020	Gabriel Olimpio	Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
209	4021	Balcão	Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
210	4022	Vitor Santos	Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
211	4023	Recebimento	Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
212	4030	Renato Pucci	Acerto de Gado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
213	4031	Iago Oliveira	Acerto de Gado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
214	4060	Gustavo Borba	Exportação	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
215	4061	Rafael Barros	Exportação	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
216	4062	Mauricio Castro	Exportação	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
217	4063	Lorena Rosa	Exportação	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
218	4064	Alesca Nascimento	Exportação	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
219	4065	Alex Nascimento	Exportação	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
220	4066	Fernanda Queiroz	Exportação	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
221	4070	Luiz Eugenio	Comercial Interno	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
222	4071	Ricardo Dalefe	Comercial Interno	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
223	4072	Lucas Ranhi	Comercial Interno	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
224	4073	Victor padovan	Comercial Interno	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
225	4074	Victor moraes	Comercial Interno	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
226	4075	Claudio Costa	Comercial Interno	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
227	4076	Robson Silva	Comercial Interno	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
228	4080	Ivanei Souza	Compra Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
229	4081	Anderson Vieira	Compra Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
230	4082	Luiz Serafim	Compra Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
231	4083	Wesley Bueno	Compra Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
232	4084	Heverton Santana	Compra Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
233	4085	Tamiris Rodrigues	Compra Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
234	4086	Eduardo Brandi	Compra Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
235	4087	Lais Oliveira	Compra Almoxarifado	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
236	4100	Vagner Souza	Contabilidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
237	4101	Ana Figueiredo	Contabilidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
238	4102	Leandro Rondoni	Contabilidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
239	4103	Juliana Sana	Contabilidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
240	4104	Giovana Okuma	Contabilidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
241	4105	Guilherme Camargo	Contabilidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
242	4106	Luis Souza	Contabilidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
243	4110	Silvio Marques	Custo	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
244	4111	Milton Neto	Custo	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
245	4120	Sandro Guimaraes	Fiscal	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
246	4121	Caio Carvalho	Fiscal	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
247	4122	Alex Querubino	Fiscal	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
248	4013	Lilian Grosso	Auditora Interna	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
249	4130	Marcia Serafim	Gerencial	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
250	4131	Nara Takahara	Gerencial	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
251	4132	Stephani Cisilo	Gerencial	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
252	4133	Paloma Mata	Gerencial	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
253	4107	Lorena Monteiro	Gerencial	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
254	4135	Jessica Souza	Gerencial	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
255	4136	Marinalva Santos	Gerencial	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
256	4140	Adriana Magro	Contas a Pagar	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
257	4141	Lauany Trava	Contas a Pagar	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
258	4142	Fernando Vasconcelos	Contas a Pagar	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
259	4143	Danilo Silva	Contas a Pagar	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
260	4144	Clovis Piveta	Contas a Pagar	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
261	4145	Adriene França	Contas a Pagar	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
262	4150	Edvaldo Pretti	Contas a Receber	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
263	4151	Rafael Constantino	Contas a Receber	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
264	4152	Eduardo Puro	Contas a Receber	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
265	4153	Regina Veronezi	Contas a Receber	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
266	4154	Gabriel Souza	Contas a Receber	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
267	4155	Andreia Muramatsu	Contas a Receber	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
268	4170	Rogerio Nascimento	Devolução	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
269	4171	Mateus Rocha	Devolução	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
270	4180	Claudinei Capuci	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
271	4181	Fabrizzio Capuci	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
272	4182	Osmar Capuci	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
273	4183	Thiago Nunes	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
274	4184	Cristina Capuci	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
275	4185	Rosangela Capuci	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
276	4186	Felipe Capuci	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
277	4187	Lais Capuci	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
278	4188	Leonardo Capuci	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
279	4189	Gabriel Capuci	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
280	4190	Paulo Capuci	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
281	4191	Luis Capuci	Diretoria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
282	4200	Nelson Suzuki	Faturamento Saída	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
283	4201	Alessandro Nascimento	Faturamento Saída	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
284	4202	Raphael Oliveira	Faturamento Saída	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
285	4203	Sergio Svet	Faturamento Saída	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
286	4210	Emerson Paz	Faturamento Entrada	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
287	4220	Rangel Filho	Jurídico	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
288	4221	Mau Borges	Jurídico	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
289	4222	Luciana Zanin	Jurídico	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
290	4240	Leandro Oliveira	PCP	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
291	4241	Fernando Pereira	PCP	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
292	4242	Daniel Zorzato	PCP	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
293	4243	Derick Vida	PCP	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
294	4250	Aline Pessim	PED	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
295	4251	Guilherme Batista	PED	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
296	4270	Rogerio Caraffa	Pricing	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
297	4280	Denise Alves	Psicologia	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
298	4281	Leticia Goes	Psicologia	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
299	4300	Rogerio Neves	RH	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
300	4301	Adamo Caires	RH	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
301	4302	Luciana Vasconcelos	RH	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
302	4303	Pablo Padoan	RH	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
303	4304	Jaciele Oliveira	RH	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
304	4305	Wesley Souza	RH	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
305	4310	Sala de reunião ADM	Sala Reunião	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
306	4311	Auditório	Sala Reunião	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
307	4320	Marla Teixeira	Sustentabilidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
308	4330	Murilo Zamora	TI Sistemas	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
309	4331	Hugo Dunde	TI Sistemas	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
310	4332	Matheus Costa	TI Sistemas	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
311	4333	Marcus Barros	TI Sistemas	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
312	4334	Douglas Figueiredo	TI Infra	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
313	4335	Kaio Oliveira	TI Infra	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
314	4336	Renan Sapia	TI Infra	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
315	4337	Diego Benevides	TI Infra	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
316	4340	Angelo Sugui	Transporte	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
317	4341	Edimara Lima	Transporte	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
318	4342	Juliano Abreu	Transporte	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
319	4343	Eduardo Ferreira	Transporte	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
320	4344	Fabio Aznar	Transporte	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
321	4400	Portaria	Portaria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
322	4500	Jose Santana	Administração Industrial	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
323	4510	Carlos Veronez	PCM	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
324	4511	Tales Geraldino	PCM	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
325	4512	João Cruz	PCM	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
326	4540	Balança Patio	Balanção	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
327	4550	Construção Civil	Construção Civil	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
328	4560	Michelli Bassiquete	Refeitório	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
329	4580	Rodrigo Rocha	Manutenção	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
330	4590	Robson Barbosa	Elétrica	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
331	4600	Marcela Fernandez	Garantia da Qualidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
332	4601	Daniele Maximo	Garantia da Qualidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
333	4602	Thaine Ramos	Garantia da Qualidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
334	4603	Lais Aleixo	Garantia da Qualidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
335	4604	Tatiane Ganda	Garantia da Qualidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
336	4605	Sara Puro	Garantia da Qualidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
337	4606	Sala Documentos	Garantia da Qualidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
338	4607	Devolução	Garantia da Qualidade	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
339	4610	Emabalagem Secundária	Embalagem Secundária	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
340	4620	Valdir (Tendal)	Embarque	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
341	4621	Tiago (Carreg Desossa)	Embarque	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
342	4622	Vitor (Carreg Miudos)	Embarque	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
343	4630	Sala de Etiqueta	Sala de Etiqueta	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
344	4650	Lavanderia	Lavanderia	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
345	4660	Graxaria	Graxaria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
346	4670	Cibal Halal	Halal	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
347	4680	Higienização	Higienização	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
348	4690	Instrumentação	Instrumentação	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
349	4720	Abate	Abate	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
350	4721	Balança Abate (Rodrigo)	Abate	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
351	4722	Silvano	Abate	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
352	4730	Desossa	Desossa	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
353	4750	Odalton Santos	Sala de Máquina	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
354	4751	Sala de Maquinas	Sala de Máquina	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
355	4760	Miúdos	Miúdos	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
356	4780	Rastreamento 1	Rastreamento	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
357	4781	Rastreamento 2	Rastreamento	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
358	4790	Ednei Francisco	Curral / Boiadeiro	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
359	4791	Sergio Occulati	Curral / Boiadeiro	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
360	4792	Renato Velasco	Curral / Boiadeiro	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
361	4793	Balança Recebimento	Curral / Boiadeiro	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
362	4794	Evandro Oliveira	Curral / Boiadeiro	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
363	4800	Odelcio Ferreira	SIF	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
364	4801	Raissa Suzuki	SIF	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
365	4802	Recepção(Rogerio Silva)	SIF	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
366	4803	Balcão (Lucas Vicente)	SIF	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
367	4804	Thiago Pereira	SIF	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
368	4900	Cleber Jordão	Segurança do Trabalho	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
369	4901	Segurança do Trabalho	Segurança do Trabalho	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
370	4910	Enfermaria	Enfermaria	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
371	4920	Sergio Corazza	Fisioterapia	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
372	4921	Sergio Corazza (Sala Fisio)	Fisioterapia	4	2026-07-27 15:18:14.774	2026-07-27 15:18:14.774
\.


--
-- Data for Name: recados; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.recados (id, titulo, conteudo, imagem, "unidadeId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: recados_audits; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.recados_audits (id, "recadoId", "userId", "userNome", acao, "dadosAntigos", "dadosNovos", "createdAt") FROM stdin;
\.


--
-- Data for Name: recados_unidades; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.recados_unidades (id, "recadoId", "unidadeId") FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") FROM stdin;
L0Eem4rhQ7XLGoYBj7lEpnSyI4eCwhgM	2026-08-03 19:18:55.567	iETqfCpdP2k3D0ut77zOcP0iHKfbj68Q	2026-07-27 19:18:55.567	2026-07-27 19:18:55.567			SIgEXSfPRaoug2S77YorCrLsgWiWizmd
KQQ7hyvHZ5ZykX2YrdLAxuGeyyodt1Lf	2026-08-03 19:25:27.756	W9UfzGSWDvbbYLop2ge51aP7Z9Yh7wJe	2026-07-27 19:25:27.756	2026-07-27 19:25:27.756		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	W4JSqLp9WdqyASjepXwwDldzEO9xFjxC
4xVDSg9Hv3b7xq6Qa0fyGMFEttLf0xlB	2026-08-05 12:07:02.842	1VoESmwaVp45eK39zpCjT2XZvTjKrLtS	2026-07-27 19:21:02.371	2026-07-29 12:07:02.845		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	SIgEXSfPRaoug2S77YorCrLsgWiWizmd
\.


--
-- Data for Name: solicitacoes_gerenciamento; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.solicitacoes_gerenciamento (id, recurso, tipo, status, "recadoId", "noticiaId", "unidadeId", "unidadeIds", titulo, conteudo, imagem, "imagemAntiga", "motivoRecusa", "solicitanteId", "solicitanteNome", "revisorId", "revisorNome", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: unidades; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.unidades (id, nome) FROM stdin;
1	Rochedo-MS
2	Nova Andradina-MS
3	Barra do Bugres-MT
4	Pirapozinho-SP
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", "unidadeId", role) FROM stdin;
SIgEXSfPRaoug2S77YorCrLsgWiWizmd	admin	admin.teste@naturafrig.com.br	f	\N	2026-07-27 19:18:55.559	2026-07-27 19:18:55.573	2	OWNER
Gd7xjIszz3Op3fj32MQKZUFsE3ORPPr3	kaue.santos	kaue.santos@naturafrig.com.br	f	\N	2026-07-27 19:21:40.978	2026-07-27 19:21:41.094	2	OWNER
ZK1KfY2i8AO7xoaEUuvyGTjs8FJl2KUF	recados	recados.teste@naturafrig.com.br	f	\N	2026-07-27 19:22:16.825	2026-07-27 19:22:16.866	2	MESSAGEONLY
jYTB4si2DYTYEfHj3cjSEcv54XbfmcWn	noticias	noticias.teste@naturafrig.com.br	f	\N	2026-07-27 19:22:43.919	2026-07-27 19:22:43.979	2	NEWSONLY
0friVJHkFU7RrXu19SRmxHcCvB46cBZe	recadosnoticias	recadosnoticias@naturafrig.com.br	f	\N	2026-07-27 19:23:24.267	2026-07-27 19:23:24.306	2	MESSAGENEWS
W4JSqLp9WdqyASjepXwwDldzEO9xFjxC	eventos	eventos.teste@naturafrig.com.br	f	\N	2026-07-27 19:23:59.005	2026-07-27 19:23:59.048	2	EVENTS
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: ramais_user
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 8, true);


--
-- Name: agenda_eventos_audits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.agenda_eventos_audits_id_seq', 9, true);


--
-- Name: agenda_eventos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.agenda_eventos_id_seq', 5, true);


--
-- Name: emails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.emails_id_seq', 20, true);


--
-- Name: jornais_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.jornais_id_seq', 1, false);


--
-- Name: noticias_audits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.noticias_audits_id_seq', 1, false);


--
-- Name: noticias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.noticias_id_seq', 1, false);


--
-- Name: ramais_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.ramais_id_seq', 372, true);


--
-- Name: recados_audits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.recados_audits_id_seq', 1, false);


--
-- Name: recados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.recados_id_seq', 1, false);


--
-- Name: recados_unidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.recados_unidades_id_seq', 1, false);


--
-- Name: solicitacoes_gerenciamento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.solicitacoes_gerenciamento_id_seq', 1, false);


--
-- Name: unidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ramais_user
--

SELECT pg_catalog.setval('public.unidades_id_seq', 4, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: ramais_user
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: agenda_eventos_audits agenda_eventos_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.agenda_eventos_audits
    ADD CONSTRAINT agenda_eventos_audits_pkey PRIMARY KEY (id);


--
-- Name: agenda_eventos agenda_eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.agenda_eventos
    ADD CONSTRAINT agenda_eventos_pkey PRIMARY KEY (id);


--
-- Name: emails emails_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT emails_pkey PRIMARY KEY (id);


--
-- Name: jornais jornais_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.jornais
    ADD CONSTRAINT jornais_pkey PRIMARY KEY (id);


--
-- Name: noticias_audits noticias_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.noticias_audits
    ADD CONSTRAINT noticias_audits_pkey PRIMARY KEY (id);


--
-- Name: noticias noticias_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.noticias
    ADD CONSTRAINT noticias_pkey PRIMARY KEY (id);


--
-- Name: ramais ramais_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.ramais
    ADD CONSTRAINT ramais_pkey PRIMARY KEY (id);


--
-- Name: recados_audits recados_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.recados_audits
    ADD CONSTRAINT recados_audits_pkey PRIMARY KEY (id);


--
-- Name: recados recados_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.recados
    ADD CONSTRAINT recados_pkey PRIMARY KEY (id);


--
-- Name: recados_unidades recados_unidades_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.recados_unidades
    ADD CONSTRAINT recados_unidades_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: solicitacoes_gerenciamento solicitacoes_gerenciamento_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.solicitacoes_gerenciamento
    ADD CONSTRAINT solicitacoes_gerenciamento_pkey PRIMARY KEY (id);


--
-- Name: unidades unidades_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: account_userId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "account_userId_idx" ON public.account USING btree ("userId");


--
-- Name: agenda_eventos_audits_createdAt_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "agenda_eventos_audits_createdAt_idx" ON public.agenda_eventos_audits USING btree ("createdAt");


--
-- Name: agenda_eventos_audits_eventoId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "agenda_eventos_audits_eventoId_idx" ON public.agenda_eventos_audits USING btree ("eventoId");


--
-- Name: agenda_eventos_audits_userId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "agenda_eventos_audits_userId_idx" ON public.agenda_eventos_audits USING btree ("userId");


--
-- Name: agenda_eventos_criadoPorId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "agenda_eventos_criadoPorId_idx" ON public.agenda_eventos USING btree ("criadoPorId");


--
-- Name: agenda_eventos_data_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX agenda_eventos_data_idx ON public.agenda_eventos USING btree (data);


--
-- Name: agenda_eventos_unidadeId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "agenda_eventos_unidadeId_idx" ON public.agenda_eventos USING btree ("unidadeId");


--
-- Name: emails_unidadeId_email_key; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE UNIQUE INDEX "emails_unidadeId_email_key" ON public.emails USING btree ("unidadeId", email);


--
-- Name: noticias_audits_createdAt_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "noticias_audits_createdAt_idx" ON public.noticias_audits USING btree ("createdAt");


--
-- Name: noticias_audits_noticiaId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "noticias_audits_noticiaId_idx" ON public.noticias_audits USING btree ("noticiaId");


--
-- Name: noticias_audits_userId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "noticias_audits_userId_idx" ON public.noticias_audits USING btree ("userId");


--
-- Name: ramais_unidadeId_numero_key; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE UNIQUE INDEX "ramais_unidadeId_numero_key" ON public.ramais USING btree ("unidadeId", numero);


--
-- Name: recados_audits_createdAt_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "recados_audits_createdAt_idx" ON public.recados_audits USING btree ("createdAt");


--
-- Name: recados_audits_recadoId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "recados_audits_recadoId_idx" ON public.recados_audits USING btree ("recadoId");


--
-- Name: recados_audits_userId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "recados_audits_userId_idx" ON public.recados_audits USING btree ("userId");


--
-- Name: recados_unidades_recadoId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "recados_unidades_recadoId_idx" ON public.recados_unidades USING btree ("recadoId");


--
-- Name: recados_unidades_recadoId_unidadeId_key; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE UNIQUE INDEX "recados_unidades_recadoId_unidadeId_key" ON public.recados_unidades USING btree ("recadoId", "unidadeId");


--
-- Name: recados_unidades_unidadeId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "recados_unidades_unidadeId_idx" ON public.recados_unidades USING btree ("unidadeId");


--
-- Name: session_token_key; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE UNIQUE INDEX session_token_key ON public.session USING btree (token);


--
-- Name: session_userId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "session_userId_idx" ON public.session USING btree ("userId");


--
-- Name: solicitacoes_gerenciamento_noticiaId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "solicitacoes_gerenciamento_noticiaId_idx" ON public.solicitacoes_gerenciamento USING btree ("noticiaId");


--
-- Name: solicitacoes_gerenciamento_recadoId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "solicitacoes_gerenciamento_recadoId_idx" ON public.solicitacoes_gerenciamento USING btree ("recadoId");


--
-- Name: solicitacoes_gerenciamento_recurso_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX solicitacoes_gerenciamento_recurso_idx ON public.solicitacoes_gerenciamento USING btree (recurso);


--
-- Name: solicitacoes_gerenciamento_solicitanteId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "solicitacoes_gerenciamento_solicitanteId_idx" ON public.solicitacoes_gerenciamento USING btree ("solicitanteId");


--
-- Name: solicitacoes_gerenciamento_status_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX solicitacoes_gerenciamento_status_idx ON public.solicitacoes_gerenciamento USING btree (status);


--
-- Name: solicitacoes_gerenciamento_unidadeId_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX "solicitacoes_gerenciamento_unidadeId_idx" ON public.solicitacoes_gerenciamento USING btree ("unidadeId");


--
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- Name: verification_identifier_idx; Type: INDEX; Schema: public; Owner: ramais_user
--

CREATE INDEX verification_identifier_idx ON public.verification USING btree (identifier);


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: agenda_eventos agenda_eventos_atualizadoPorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.agenda_eventos
    ADD CONSTRAINT "agenda_eventos_atualizadoPorId_fkey" FOREIGN KEY ("atualizadoPorId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: agenda_eventos agenda_eventos_criadoPorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.agenda_eventos
    ADD CONSTRAINT "agenda_eventos_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: agenda_eventos agenda_eventos_unidadeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.agenda_eventos
    ADD CONSTRAINT "agenda_eventos_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES public.unidades(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: emails emails_unidadeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT "emails_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES public.unidades(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ramais ramais_unidadeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.ramais
    ADD CONSTRAINT "ramais_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES public.unidades(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: recados recados_unidadeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.recados
    ADD CONSTRAINT "recados_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES public.unidades(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: recados_unidades recados_unidades_recadoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.recados_unidades
    ADD CONSTRAINT "recados_unidades_recadoId_fkey" FOREIGN KEY ("recadoId") REFERENCES public.recados(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: recados_unidades recados_unidades_unidadeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.recados_unidades
    ADD CONSTRAINT "recados_unidades_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES public.unidades(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: solicitacoes_gerenciamento solicitacoes_gerenciamento_noticiaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.solicitacoes_gerenciamento
    ADD CONSTRAINT "solicitacoes_gerenciamento_noticiaId_fkey" FOREIGN KEY ("noticiaId") REFERENCES public.noticias(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: solicitacoes_gerenciamento solicitacoes_gerenciamento_recadoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.solicitacoes_gerenciamento
    ADD CONSTRAINT "solicitacoes_gerenciamento_recadoId_fkey" FOREIGN KEY ("recadoId") REFERENCES public.recados(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: solicitacoes_gerenciamento solicitacoes_gerenciamento_unidadeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public.solicitacoes_gerenciamento
    ADD CONSTRAINT "solicitacoes_gerenciamento_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES public.unidades(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user user_unidadeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ramais_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "user_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES public.unidades(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: ramais_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict wrFtscxtuov0Z2KNHiFe7bpvhA5WKFYsmKozcwk1vYIzgWRsbmI1NaV1C4tiZwi

