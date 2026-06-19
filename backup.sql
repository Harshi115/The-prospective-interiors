--
-- PostgreSQL database dump
--

\restrict MquiJxhULRpzbptCCrZ35uWQTVnl7tdhIvtB8hmnTAXHGWOL8Wl8baiisONoCwm

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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
-- Name: enum_inquiries_project_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_inquiries_project_type AS ENUM (
    'Residential',
    'Commercial',
    'Hospitality',
    'Industrial',
    'Healthcare',
    'Other'
);


ALTER TYPE public.enum_inquiries_project_type OWNER TO postgres;

--
-- Name: enum_inquiries_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_inquiries_status AS ENUM (
    'New',
    'Contacted',
    'Closed'
);


ALTER TYPE public.enum_inquiries_status OWNER TO postgres;

--
-- Name: enum_projects_sector; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_projects_sector AS ENUM (
    'Hospitality',
    'Industrial',
    'Healthcare',
    'Retail',
    'Residential',
    'Commercial',
    'Civic'
);


ALTER TYPE public.enum_projects_sector OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: inquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inquiries (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying,
    phone character varying,
    project_type public.enum_inquiries_project_type,
    message character varying,
    submitted_at timestamp(3) with time zone,
    status public.enum_inquiries_status,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.inquiries OWNER TO postgres;

--
-- Name: inquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inquiries_id_seq OWNER TO postgres;

--
-- Name: inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inquiries_id_seq OWNED BY public.inquiries.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_id_seq OWNER TO postgres;

--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    hero_headline character varying,
    hero_subtext character varying,
    hero_image_id integer,
    philosophy_text character varying,
    seo_title character varying,
    seo_description character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pages OWNER TO postgres;

--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pages_id_seq OWNER TO postgres;

--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: payload_kv; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE public.payload_kv OWNER TO postgres;

--
-- Name: payload_kv_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_kv_id_seq OWNER TO postgres;

--
-- Name: payload_kv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_locked_documents OWNER TO postgres;

--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_locked_documents_id_seq OWNER TO postgres;

--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    media_id integer,
    projects_id integer,
    services_id integer,
    team_members_id integer,
    stats_id integer,
    pages_id integer,
    inquiries_id integer
);


ALTER TABLE public.payload_locked_documents_rels OWNER TO postgres;

--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNER TO postgres;

--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_migrations OWNER TO postgres;

--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_migrations_id_seq OWNER TO postgres;

--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_preferences OWNER TO postgres;

--
-- Name: payload_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_preferences_id_seq OWNER TO postgres;

--
-- Name: payload_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);


ALTER TABLE public.payload_preferences_rels OWNER TO postgres;

--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNER TO postgres;

--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    client character varying,
    location character varying,
    year numeric,
    sector public.enum_projects_sector,
    hero_image_id integer,
    description character varying,
    featured boolean DEFAULT false,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    area character varying
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: projects_rels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    media_id integer
);


ALTER TABLE public.projects_rels OWNER TO postgres;

--
-- Name: projects_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_rels_id_seq OWNER TO postgres;

--
-- Name: projects_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_rels_id_seq OWNED BY public.projects_rels.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying,
    icon character varying,
    "order" numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stats (
    id integer NOT NULL,
    label character varying NOT NULL,
    value character varying NOT NULL,
    "order" numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.stats OWNER TO postgres;

--
-- Name: stats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stats_id_seq OWNER TO postgres;

--
-- Name: stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stats_id_seq OWNED BY public.stats.id;


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    name character varying NOT NULL,
    role character varying,
    photo_id integer,
    bio character varying,
    "order" numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.team_members OWNER TO postgres;

--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_members_id_seq OWNER TO postgres;

--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


ALTER TABLE public.users_sessions OWNER TO postgres;

--
-- Name: inquiries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inquiries ALTER COLUMN id SET DEFAULT nextval('public.inquiries_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: payload_kv id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);


--
-- Name: payload_locked_documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);


--
-- Name: payload_preferences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: projects_rels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects_rels ALTER COLUMN id SET DEFAULT nextval('public.projects_rels_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: stats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stats ALTER COLUMN id SET DEFAULT nextval('public.stats_id_seq'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: inquiries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inquiries (id, name, email, phone, project_type, message, submitted_at, status, updated_at, created_at) FROM stdin;
1	HARSHITA CHATURVEDI	harshita.chaturvedi2002@gmail.com	09024996194	Healthcare	i want	2026-06-12 00:00:00+05:30	New	2026-06-12 10:49:24.279+05:30	2026-06-12 10:49:24.279+05:30
2	HARSHITA CHATURVEDI	harshita.chaturvedi2002@gmail.com	09024996194	Residential	heyyyyy	2026-06-15 20:42:35.361+05:30	New	2026-06-15 20:42:35.411+05:30	2026-06-15 20:42:35.411+05:30
3	HARSHITA CHATURVEDI	harshita.chaturvedi2002@gmail.com	09024996194	Hospitality	hey	2026-06-16 14:03:58.938+05:30	New	2026-06-16 14:03:59.105+05:30	2026-06-16 14:03:59.098+05:30
4	HARSHITA CHATURVEDI	harshita.chaturvedi2002@gmail.com	9024996194	Hospitality	i want my hotel design in mumbai	2026-06-16 14:46:03.04+05:30	New	2026-06-16 14:46:03.131+05:30	2026-06-16 14:46:03.126+05:30
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id, alt, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y) FROM stdin;
1	modern living room interior	2026-06-09 19:27:25.316+05:30	2026-06-09 19:27:25.316+05:30	/api/media/file/P-h-uxDy5WKF15cr47vt992uh_1XKqnTsQ66FhxRkGRzD1Z8YRHCkI5Pk3k_J0Ixo5TsTNTzeHCW_ffLF4XjyS4h1yNbDF5Y-O47-_XaYg26Aipv1DmSHem90Vf8goXKpvMKhrVn-79xb8HnlIO30As0HtTK8HTw5ibKReAqVwIQHWz4zTq0rlMjetqdMzCe.jpeg	\N	P-h-uxDy5WKF15cr47vt992uh_1XKqnTsQ66FhxRkGRzD1Z8YRHCkI5Pk3k_J0Ixo5TsTNTzeHCW_ffLF4XjyS4h1yNbDF5Y-O47-_XaYg26Aipv1DmSHem90Vf8goXKpvMKhrVn-79xb8HnlIO30As0HtTK8HTw5ibKReAqVwIQHWz4zTq0rlMjetqdMzCe.jpeg	image/jpeg	249161	2048	1365	50	50
2	A premium fine-dining restaurant interior project featuring elegant seating, ambient lighting, custom furniture, and modern hospitality design focused on guest comfort and luxury dining experiences. 	2026-06-09 20:15:27.467+05:30	2026-06-09 20:15:27.46+05:30	/api/media/file/WhatsApp%20Image%202026-06-09%20at%208.16.37%20PM.jpeg	\N	WhatsApp Image 2026-06-09 at 8.16.37 PM.jpeg	image/jpeg	268349	1536	1024	50	50
3	bb	2026-06-09 20:39:27.351+05:30	2026-06-09 20:39:27.35+05:30	/api/media/file/WhatsApp%20Image%202026-06-09%20at%208.40.35%20PM.jpeg	\N	WhatsApp Image 2026-06-09 at 8.40.35 PM.jpeg	image/jpeg	206709	1536	1024	50	50
4	mmnn	2026-06-09 20:42:16.778+05:30	2026-06-09 20:42:16.778+05:30	/api/media/file/WhatsApp%20Image%202026-06-09%20at%208.43.16%20PM.jpeg	\N	WhatsApp Image 2026-06-09 at 8.43.16 PM.jpeg	image/jpeg	227332	1536	1024	50	50
5	nn	2026-06-10 14:21:56.303+05:30	2026-06-10 14:21:56.303+05:30	/api/media/file/ChatGPT%20Image%20Jun%2010%2C%202026%2C%2002_20_07%20PM%20(1).png	\N	ChatGPT Image Jun 10, 2026, 02_20_07 PM (1).png	image/png	2388585	1536	1024	50	50
6	mm	2026-06-10 14:22:12.084+05:30	2026-06-10 14:22:12.084+05:30	/api/media/file/ChatGPT%20Image%20Jun%2010%2C%202026%2C%2002_16_26%20PM.png	\N	ChatGPT Image Jun 10, 2026, 02_16_26 PM.png	image/png	2441935	1536	1024	50	50
7	,,	2026-06-10 14:22:24.964+05:30	2026-06-10 14:22:24.964+05:30	/api/media/file/WhatsApp%20Image%202026-06-09%20at%208.43.16%20PM-1.jpeg	\N	WhatsApp Image 2026-06-09 at 8.43.16 PM-1.jpeg	image/jpeg	227332	1536	1024	50	50
8	..	2026-06-10 14:22:40.744+05:30	2026-06-10 14:22:40.744+05:30	/api/media/file/WhatsApp%20Image%202026-06-09%20at%208.40.35%20PM-1.jpeg	\N	WhatsApp Image 2026-06-09 at 8.40.35 PM-1.jpeg	image/jpeg	206709	1536	1024	50	50
9	Cafe Arista main seating area	2026-06-10 14:50:14.179+05:30	2026-06-10 14:50:14.165+05:30	/api/media/file/OJTNJws3LQKPNcuh3ZjV2ljuVJ9VhfLLEz6vb7vfPDUc6aj09SVnmaMpO2rEUXuW6u-454--UIHh_gnLl--RK4gjZy1aToO903pcj6AaeE7MccSm_Jef3Y-A5ybKmfZKjxosHbfXf94U9b2N17_7EJ2wWEh3I6xeSb3i2m_drvRxbFXaGqx1_f0A063vmgZI.jpeg	\N	OJTNJws3LQKPNcuh3ZjV2ljuVJ9VhfLLEz6vb7vfPDUc6aj09SVnmaMpO2rEUXuW6u-454--UIHh_gnLl--RK4gjZy1aToO903pcj6AaeE7MccSm_Jef3Y-A5ybKmfZKjxosHbfXf94U9b2N17_7EJ2wWEh3I6xeSb3i2m_drvRxbFXaGqx1_f0A063vmgZI.jpeg	image/jpeg	2826918	5160	3440	50	50
10	Cafe Arista coffee counter	2026-06-10 14:50:45.964+05:30	2026-06-10 14:50:45.964+05:30	/api/media/file/0nNmVv_p1uRP5fvMd2LUxI22UnrcV-LVPaEp7VRbkBUTjbcNKLzBo8GdI07JBENni4xh4JOQUqaygdTbYROr0Qfcvetd0xnA5HHkPhOCsMd8d6rIb1THqzLyx9371-DSCp9HhZLvjap9_cOW8lRdhn-rlqllFQiKvXa8ITCJRKZYd8JCuwuvjJCRmIiTpuYB.jpeg	\N	0nNmVv_p1uRP5fvMd2LUxI22UnrcV-LVPaEp7VRbkBUTjbcNKLzBo8GdI07JBENni4xh4JOQUqaygdTbYROr0Qfcvetd0xnA5HHkPhOCsMd8d6rIb1THqzLyx9371-DSCp9HhZLvjap9_cOW8lRdhn-rlqllFQiKvXa8ITCJRKZYd8JCuwuvjJCRmIiTpuYB.jpeg	image/jpeg	58451	700	467	50	50
11	Cafe Arista indoor seating area	2026-06-10 14:51:19.461+05:30	2026-06-10 14:51:19.461+05:30	/api/media/file/FwbN75zu9oB7qH35yfzAdqQ7pKKJ_1M0XvhHDZUkOIBPgrbAK6jhvzo0sVBC3x2zH9tF1R9gzV0WdCh0MXh_2OAr2tGPzngufUnDHBiFwjyRfW5xm5f9dcLlfOUYhFRI99p7Z22o7xn3CvJkJ__BdH4Q8b6taWMDrbQFyOt3lhWoZCf94mWZXghxHBt5qh0e.jpeg	\N	FwbN75zu9oB7qH35yfzAdqQ7pKKJ_1M0XvhHDZUkOIBPgrbAK6jhvzo0sVBC3x2zH9tF1R9gzV0WdCh0MXh_2OAr2tGPzngufUnDHBiFwjyRfW5xm5f9dcLlfOUYhFRI99p7Z22o7xn3CvJkJ__BdH4Q8b6taWMDrbQFyOt3lhWoZCf94mWZXghxHBt5qh0e.jpeg	image/jpeg	261747	2048	1366	50	50
12	Cafe Arista window side seating	2026-06-10 14:52:16.748+05:30	2026-06-10 14:52:16.747+05:30	/api/media/file/FwbN75zu9oB7qH35yfzAdqQ7pKKJ_1M0XvhHDZUkOIBPgrbAK6jhvzo0sVBC3x2zH9tF1R9gzV0WdCh0MXh_2OAr2tGPzngufUnDHBiFwjyRfW5xm5f9dcLlfOUYhFRI99p7Z22o7xn3CvJkJ__BdH4Q8b6taWMDrbQFyOt3lhWoZCf94mWZXghxHBt5qh0e-1.jpeg	\N	FwbN75zu9oB7qH35yfzAdqQ7pKKJ_1M0XvhHDZUkOIBPgrbAK6jhvzo0sVBC3x2zH9tF1R9gzV0WdCh0MXh_2OAr2tGPzngufUnDHBiFwjyRfW5xm5f9dcLlfOUYhFRI99p7Z22o7xn3CvJkJ__BdH4Q8b6taWMDrbQFyOt3lhWoZCf94mWZXghxHBt5qh0e-1.jpeg	image/jpeg	261747	2048	1366	50	50
13	Cafe Arista window side seating	2026-06-10 14:52:23.657+05:30	2026-06-10 14:52:23.657+05:30	/api/media/file/FwbN75zu9oB7qH35yfzAdqQ7pKKJ_1M0XvhHDZUkOIBPgrbAK6jhvzo0sVBC3x2zH9tF1R9gzV0WdCh0MXh_2OAr2tGPzngufUnDHBiFwjyRfW5xm5f9dcLlfOUYhFRI99p7Z22o7xn3CvJkJ__BdH4Q8b6taWMDrbQFyOt3lhWoZCf94mWZXghxHBt5qh0e-2.jpeg	\N	FwbN75zu9oB7qH35yfzAdqQ7pKKJ_1M0XvhHDZUkOIBPgrbAK6jhvzo0sVBC3x2zH9tF1R9gzV0WdCh0MXh_2OAr2tGPzngufUnDHBiFwjyRfW5xm5f9dcLlfOUYhFRI99p7Z22o7xn3CvJkJ__BdH4Q8b6taWMDrbQFyOt3lhWoZCf94mWZXghxHBt5qh0e-2.jpeg	image/jpeg	261747	2048	1366	50	50
14	Cafe Arista window side seating	2026-06-10 14:52:52.79+05:30	2026-06-10 14:52:52.79+05:30	/api/media/file/yxD2yJEUqvd4jPZFerJtUS1dNTzyhCTD2LufDHQIETdKQI45urEeFA1q64s-v7mfBg7vy73s4DdrQwtV6yNzNroolxzjWAHCmucFGaMVKIID4251Srv07CNk0Ng50a7QbaFFTMMqRUMF0YCIhhCqf8QHGT3baPSqpgBmI79qbLlNTN_7MoIyI2KRvbSU7jms.jpeg	\N	yxD2yJEUqvd4jPZFerJtUS1dNTzyhCTD2LufDHQIETdKQI45urEeFA1q64s-v7mfBg7vy73s4DdrQwtV6yNzNroolxzjWAHCmucFGaMVKIID4251Srv07CNk0Ng50a7QbaFFTMMqRUMF0YCIhhCqf8QHGT3baPSqpgBmI79qbLlNTN_7MoIyI2KRvbSU7jms.jpeg	image/jpeg	260688	2048	1365	50	50
15	Cafe Arista lounge corner	2026-06-10 14:53:20.604+05:30	2026-06-10 14:53:20.604+05:30	/api/media/file/G2aMrG-7byJwf0IjnMfoujrCkJi0NO_M0-RdhWS3A1bi_3fPxeDs7u8iBlsx45g-Bi2EoEFJd6nll35g9P7rfOMo4DTUkSOkORr0zoGmckU8evUlw_0luoM_1ElJ6Zg0-M5UTJyXRYSfBQoofiDSiFf8iVr2SFFoVE_rsx_DZEU.jpeg	\N	G2aMrG-7byJwf0IjnMfoujrCkJi0NO_M0-RdhWS3A1bi_3fPxeDs7u8iBlsx45g-Bi2EoEFJd6nll35g9P7rfOMo4DTUkSOkORr0zoGmckU8evUlw_0luoM_1ElJ6Zg0-M5UTJyXRYSfBQoofiDSiFf8iVr2SFFoVE_rsx_DZEU.jpeg	image/jpeg	106472	736	1104	50	50
16	Cafe Arista decorative interior details	2026-06-10 14:54:30.933+05:30	2026-06-10 14:54:30.933+05:30	/api/media/file/TQAsIeuaSrj7Ufi6AsakJ0QIS9NPz-zr6i59uEFx-hf4ZrLSCW9lftFIWYWxzeFCegzbMReVm3PtZBL4p9PFYigRlkw8OYuAASNxIPXCZH-OWLb3h5E2kg3wVafdngl8Tl1Q8v7YGxUG4bYRtCSxLLM12YVckSm_uMoMNkoibMxAQFhbzvY00x-ziTK40ipl.jpeg	\N	TQAsIeuaSrj7Ufi6AsakJ0QIS9NPz-zr6i59uEFx-hf4ZrLSCW9lftFIWYWxzeFCegzbMReVm3PtZBL4p9PFYigRlkw8OYuAASNxIPXCZH-OWLb3h5E2kg3wVafdngl8Tl1Q8v7YGxUG4bYRtCSxLLM12YVckSm_uMoMNkoibMxAQFhbzvY00x-ziTK40ipl.jpeg	image/jpeg	369362	2048	1365	50	50
17	nbn	2026-06-12 10:36:01.373+05:30	2026-06-12 10:36:01.371+05:30	/api/media/file/visualization-modern-residential-interior-design_1107902-1077.avif	\N	visualization-modern-residential-interior-design_1107902-1077.avif	image/avif	205410	2000	2000	50	50
18	nnn	2026-06-12 10:36:27.786+05:30	2026-06-12 10:36:27.785+05:30	/api/media/file/interior-design-of-a-house-1571460.jpg	\N	interior-design-of-a-house-1571460.jpg	image/jpeg	930165	3400	2186	50	50
19	bbnn	2026-06-12 10:36:42.428+05:30	2026-06-12 10:36:42.428+05:30	/api/media/file/OIP.jpeg	\N	OIP.jpeg	image/jpeg	10932	220	220	50	50
20	bbn	2026-06-12 10:36:56.055+05:30	2026-06-12 10:36:56.055+05:30	/api/media/file/1-3.png	\N	1-3.png	image/png	1412319	1366	768	50	50
21	mm	2026-06-12 10:58:27.676+05:30	2026-06-12 10:58:27.676+05:30	/api/media/file/5cacaf8c26199c95fd68ff75b4b0f589.jpg	\N	5cacaf8c26199c95fd68ff75b4b0f589.jpg	image/jpeg	231486	1400	1050	50	50
22	mnm	2026-06-12 10:58:36.477+05:30	2026-06-12 10:58:36.476+05:30	/api/media/file/2e7db186042aed0d77e055a27e3bdd37.jpg	\N	2e7db186042aed0d77e055a27e3bdd37.jpg	image/jpeg	41271	600	461	50	50
23	mm	2026-06-12 10:58:43.086+05:30	2026-06-12 10:58:43.086+05:30	/api/media/file/v2-9xa6b-v69ca.jpg	\N	v2-9xa6b-v69ca.jpg	image/jpeg	138560	1216	832	50	50
24	jjj	2026-06-12 10:58:50.851+05:30	2026-06-12 10:58:50.851+05:30	/api/media/file/Medical-Clinic-Interior-Design-41-jpg.webp	\N	Medical-Clinic-Interior-Design-41-jpg.webp	image/webp	46448	1024	683	50	50
25	mn	2026-06-12 11:02:01.334+05:30	2026-06-12 11:02:01.334+05:30	/api/media/file/OIP%20(1).jpeg	\N	OIP (1).jpeg	image/jpeg	14938	474	193	50	50
26	mm	2026-06-12 11:11:57.33+05:30	2026-06-12 11:11:57.33+05:30	/api/media/file/photo-1600585154340-be6161a56a0c.jpeg	\N	photo-1600585154340-be6161a56a0c.jpeg	image/jpeg	258645	1200	800	50	50
27	nm	2026-06-12 11:15:19.412+05:30	2026-06-12 11:15:19.412+05:30	/api/media/file/photo-1616486338812-3dadae4b4ace.jpeg	\N	photo-1616486338812-3dadae4b4ace.jpeg	image/jpeg	65154	800	450	50	50
28	nm	2026-06-12 11:15:19.512+05:30	2026-06-12 11:15:19.512+05:30	/api/media/file/photo-1615529182904-14819c35db37.jpeg	\N	photo-1615529182904-14819c35db37.jpeg	image/jpeg	138412	800	800	50	50
29	nm	2026-06-12 11:15:19.56+05:30	2026-06-12 11:15:19.56+05:30	/api/media/file/photo-1600210492486-724fe5c67fb0.jpeg	\N	photo-1600210492486-724fe5c67fb0.jpeg	image/jpeg	102942	800	600	50	50
30	nm	2026-06-12 11:15:19.62+05:30	2026-06-12 11:15:19.62+05:30	/api/media/file/photo-1600573472591-ee6b68d14c68.jpeg	\N	photo-1600573472591-ee6b68d14c68.jpeg	image/jpeg	76010	800	533	50	50
31	io	2026-06-12 11:15:19.662+05:30	2026-06-12 11:15:19.662+05:30	/api/media/file/photo-1600566753086-00f18fb6b3ea.jpeg	\N	photo-1600566753086-00f18fb6b3ea.jpeg	image/jpeg	81327	800	533	50	50
32	mm	2026-06-12 11:40:09.392+05:30	2026-06-12 11:40:09.39+05:30	/api/media/file/photo-1580582932707-520aed937b7b.jpeg	\N	photo-1580582932707-520aed937b7b.jpeg	image/jpeg	149034	1200	675	50	50
33	mmm	2026-06-12 11:41:32.882+05:30	2026-06-12 11:41:32.882+05:30	/api/media/file/OIP%20(2).jpeg	\N	OIP (2).jpeg	image/jpeg	24929	393	220	50	50
34	mm	2026-06-12 11:44:25.378+05:30	2026-06-12 11:44:25.377+05:30	/api/media/file/OIP%20(6).jpeg	\N	OIP (6).jpeg	image/jpeg	17233	331	220	50	50
35	bb	2026-06-12 11:44:25.466+05:30	2026-06-12 11:44:25.465+05:30	/api/media/file/OIP%20(5).jpeg	\N	OIP (5).jpeg	image/jpeg	14758	367	220	50	50
36	bb	2026-06-12 11:44:25.513+05:30	2026-06-12 11:44:25.513+05:30	/api/media/file/596f64af8ae14534a180a3dab423b597.jpg	\N	596f64af8ae14534a180a3dab423b597.jpg	image/jpeg	78953	735	434	50	50
37	bb	2026-06-12 11:44:25.559+05:30	2026-06-12 11:44:25.559+05:30	/api/media/file/OIP%20(4).jpeg	\N	OIP (4).jpeg	image/jpeg	8622	146	219	50	50
38	hb	2026-06-12 11:44:25.605+05:30	2026-06-12 11:44:25.605+05:30	/api/media/file/OIP%20(3).jpeg	\N	OIP (3).jpeg	image/jpeg	10605	177	220	50	50
39	mm	2026-06-12 18:09:08.508+05:30	2026-06-12 18:09:08.506+05:30	/api/media/file/OIP%20(2)-1.jpeg	\N	OIP (2)-1.jpeg	image/jpeg	12584	241	220	50	50
40	,,	2026-06-12 18:09:39.044+05:30	2026-06-12 18:09:39.043+05:30	/api/media/file/OIP%20(3)-1.jpeg	\N	OIP (3)-1.jpeg	image/jpeg	14381	321	220	50	50
41	bb	2026-06-12 18:09:39.138+05:30	2026-06-12 18:09:39.138+05:30	/api/media/file/1000_F_268599980_It9MlQHndGYohbC0mfPuHR0hitRM8BnG.jpg	\N	1000_F_268599980_It9MlQHndGYohbC0mfPuHR0hitRM8BnG.jpg	image/jpeg	288255	1000	750	50	50
42	bn	2026-06-12 18:09:39.221+05:30	2026-06-12 18:09:39.22+05:30	/api/media/file/OIP-1.jpeg	\N	OIP-1.jpeg	image/jpeg	13817	330	220	50	50
43	nn	2026-06-12 18:11:46.52+05:30	2026-06-12 18:11:46.52+05:30	/api/media/file/OIP%20(5)-1.jpeg	\N	OIP (5)-1.jpeg	image/jpeg	11782	220	220	50	50
44	bb	2026-06-12 18:11:46.615+05:30	2026-06-12 18:11:46.614+05:30	/api/media/file/OIP%20(4)-1.jpeg	\N	OIP (4)-1.jpeg	image/jpeg	17402	393	220	50	50
45	Ora Jewellery Studio Interior - Banjara Hills Hyderabad	2026-06-12 18:30:27.981+05:30	2026-06-12 18:30:27.981+05:30	/api/media/file/OIP%20(6)-1.jpeg	\N	OIP (6)-1.jpeg	image/jpeg	19653	330	220	50	50
46	nm	2026-06-12 18:30:56.365+05:30	2026-06-12 18:30:56.365+05:30	/api/media/file/OIP%20(9).jpeg	\N	OIP (9).jpeg	image/jpeg	18315	314	220	50	50
47	nn	2026-06-12 18:30:56.463+05:30	2026-06-12 18:30:56.463+05:30	/api/media/file/OIP%20(8).jpeg	\N	OIP (8).jpeg	image/jpeg	16884	330	220	50	50
48	vb	2026-06-12 18:30:56.55+05:30	2026-06-12 18:30:56.55+05:30	/api/media/file/OIP%20(7).jpeg	\N	OIP (7).jpeg	image/jpeg	10729	146	219	50	50
49	..	2026-06-12 18:36:34.947+05:30	2026-06-12 18:36:34.947+05:30	/api/media/file/Modern-Neutral-Living-Room-Reno-After-Rendering.webp	\N	Modern-Neutral-Living-Room-Reno-After-Rendering.webp	image/webp	187788	2000	855	50	50
50	,,	2026-06-12 18:37:50.549+05:30	2026-06-12 18:37:50.549+05:30	/api/media/file/39-signs-you-have-an-old-money-kitchen-and-not-some-gaudy-ne-featured.webp	\N	39-signs-you-have-an-old-money-kitchen-and-not-some-gaudy-ne-featured.webp	image/webp	139992	1600	1600	50	50
51	nn	2026-06-12 18:37:51.504+05:30	2026-06-12 18:37:51.504+05:30	/api/media/file/31-bedroom-features-from-the-1960s-we-all-just-accepted-like-featured.webp	\N	31-bedroom-features-from-the-1960s-we-all-just-accepted-like-featured.webp	image/webp	167812	1600	1600	50	50
52	bb	2026-06-12 18:37:51.929+05:30	2026-06-12 18:37:51.928+05:30	/api/media/file/50-things-you-ll-find-in-homes-that-actually-feel-good-to-co-featured.webp	\N	50-things-you-ll-find-in-homes-that-actually-feel-good-to-co-featured.webp	image/webp	97998	1024	1024	50	50
53	nn	2026-06-12 18:37:52.639+05:30	2026-06-12 18:37:52.639+05:30	/api/media/file/builder-grade-Foyer-for-People-Who-Treat-the-Entryway-as-a-Storage-Unit.webp	\N	builder-grade-Foyer-for-People-Who-Treat-the-Entryway-as-a-Storage-Unit.webp	image/webp	105548	1600	1600	50	50
54	nn	2026-06-12 18:37:53.758+05:30	2026-06-12 18:37:53.757+05:30	/api/media/file/builder-grade-primary-Bedroom-for-People-Who-Treat-Their-Bedroom-Like-an-Office.webp	\N	builder-grade-primary-Bedroom-for-People-Who-Treat-Their-Bedroom-Like-an-Office.webp	image/webp	232944	1600	1600	50	50
55	nn	2026-06-12 18:37:54.721+05:30	2026-06-12 18:37:54.721+05:30	/api/media/file/what-if-open-concept-homes-never-happened-26-ways-daily-lif-featured.webp	\N	what-if-open-concept-homes-never-happened-26-ways-daily-lif-featured.webp	image/webp	118458	1600	1600	50	50
56	nn	2026-06-12 18:37:55.744+05:30	2026-06-12 18:37:55.744+05:30	/api/media/file/builder-grade-Kitchen-for-Social-Climbers.webp	\N	builder-grade-Kitchen-for-Social-Climbers.webp	image/webp	109100	1600	1600	50	50
57	nn	2026-06-12 18:37:55.935+05:30	2026-06-12 18:37:55.935+05:30	/api/media/file/Online-Designer-Combined-LivingDining-3D-Model-2.webp	\N	Online-Designer-Combined-LivingDining-3D-Model-2.webp	image/webp	21332	499	332	50	50
58	mm	2026-06-15 19:24:21.922+05:30	2026-06-15 19:24:21.921+05:30	/api/media/file/lr-1750754841-VvYj3.avif	\N	lr-1750754841-VvYj3.avif	image/avif	64622	1920	1280	50	50
59	,,	2026-06-15 19:25:52.858+05:30	2026-06-15 19:25:52.858+05:30	/api/media/file/tv-1750754839-pPi2Y.avif	\N	tv-1750754839-pPi2Y.avif	image/avif	34907	1920	1280	50	50
60	..	2026-06-15 19:25:54.418+05:30	2026-06-15 19:25:54.418+05:30	/api/media/file/dr-1-1763980215-sVaxh.avif	\N	dr-1-1763980215-sVaxh.avif	image/avif	43068	1920	1280	50	50
61	..	2026-06-15 19:25:56.332+05:30	2026-06-15 19:25:56.332+05:30	/api/media/file/lr-1-1750754840-immyI.avif	\N	lr-1-1750754840-immyI.avif	image/avif	66009	1920	1280	50	50
62	mm	2026-06-15 20:07:40.381+05:30	2026-06-15 20:07:40.378+05:30	/api/media/file/69e8d05a9ce7e888328fdc1d_WhatsApp%20Image%202026-04-17%20at%2010.20.33%20AM%20(1).jpeg	\N	69e8d05a9ce7e888328fdc1d_WhatsApp Image 2026-04-17 at 10.20.33 AM (1).jpeg	image/jpeg	332859	1600	1067	50	50
63	..	2026-06-15 20:10:03.921+05:30	2026-06-15 20:10:03.921+05:30	/api/media/file/69e8d06cd142b26ffd10dbee_WhatsApp%20Image%202026-04-17%20at%2010.21.06%20AM-p-1080.jpeg	\N	69e8d06cd142b26ffd10dbee_WhatsApp Image 2026-04-17 at 10.21.06 AM-p-1080.jpeg	image/jpeg	85225	1080	720	50	50
64	mm	2026-06-15 20:10:03.982+05:30	2026-06-15 20:10:03.982+05:30	/api/media/file/69e8d06c828fcbe5eb50c070_WhatsApp%20Image%202026-04-17%20at%2010.21.30%20AM-p-1080.jpeg	\N	69e8d06c828fcbe5eb50c070_WhatsApp Image 2026-04-17 at 10.21.30 AM-p-1080.jpeg	image/jpeg	88693	1080	720	50	50
65	..	2026-06-15 20:10:04.035+05:30	2026-06-15 20:10:04.035+05:30	/api/media/file/69e8d06cf74c484f86091ed5_WhatsApp%20Image%202026-04-17%20at%2010.21.25%20AM-p-1080.jpeg	\N	69e8d06cf74c484f86091ed5_WhatsApp Image 2026-04-17 at 10.21.25 AM-p-1080.jpeg	image/jpeg	88949	1080	720	50	50
66	nnn	2026-06-15 20:10:04.081+05:30	2026-06-15 20:10:04.081+05:30	/api/media/file/69e8d06caf043c3492f3b348_WhatsApp%20Image%202026-04-17%20at%2010.21.20%20AM-p-1080.jpeg	\N	69e8d06caf043c3492f3b348_WhatsApp Image 2026-04-17 at 10.21.20 AM-p-1080.jpeg	image/jpeg	89641	1080	720	50	50
67	mm	2026-06-15 20:10:04.163+05:30	2026-06-15 20:10:04.163+05:30	/api/media/file/69e8d06c4e74cf9c4ca3d2ce_WhatsApp%20Image%202026-04-17%20at%2010.21.14%20AM-p-1080.jpeg	\N	69e8d06c4e74cf9c4ca3d2ce_WhatsApp Image 2026-04-17 at 10.21.14 AM-p-1080.jpeg	image/jpeg	84286	1080	720	50	50
68	nn	2026-06-15 20:10:04.201+05:30	2026-06-15 20:10:04.201+05:30	/api/media/file/69e8d06d8b4db3ba1a4fc519_WhatsApp%20Image%202026-04-17%20at%2010.20.12%20AM-p-1080.jpeg	\N	69e8d06d8b4db3ba1a4fc519_WhatsApp Image 2026-04-17 at 10.20.12 AM-p-1080.jpeg	image/jpeg	107797	1080	720	50	50
69	mm	2026-06-15 20:10:04.247+05:30	2026-06-15 20:10:04.246+05:30	/api/media/file/69e8d06ca4963d7d2f3081d9_WhatsApp%20Image%202026-04-17%20at%2010.20.58%20AM-p-1080.jpeg	\N	69e8d06ca4963d7d2f3081d9_WhatsApp Image 2026-04-17 at 10.20.58 AM-p-1080.jpeg	image/jpeg	119249	1080	720	50	50
70	mm	2026-06-15 20:10:04.285+05:30	2026-06-15 20:10:04.285+05:30	/api/media/file/69e8d06cfffa5ad631228ed4_WhatsApp%20Image%202026-04-17%20at%2010.20.53%20AM-p-1080.jpeg	\N	69e8d06cfffa5ad631228ed4_WhatsApp Image 2026-04-17 at 10.20.53 AM-p-1080.jpeg	image/jpeg	81870	1080	720	50	50
71	nn	2026-06-15 20:10:04.321+05:30	2026-06-15 20:10:04.321+05:30	/api/media/file/69e8d06c59c51af6a57c8c10_WhatsApp%20Image%202026-04-17%20at%2010.20.48%20AM-p-1080.jpeg	\N	69e8d06c59c51af6a57c8c10_WhatsApp Image 2026-04-17 at 10.20.48 AM-p-1080.jpeg	image/jpeg	123466	1080	720	50	50
72	nn	2026-06-15 20:10:04.364+05:30	2026-06-15 20:10:04.364+05:30	/api/media/file/69e8d06c503a0226b8e75012_WhatsApp%20Image%202026-04-17%20at%2010.20.44%20AM-p-1080.jpeg	\N	69e8d06c503a0226b8e75012_WhatsApp Image 2026-04-17 at 10.20.44 AM-p-1080.jpeg	image/jpeg	112164	1080	719	50	50
73	mm	2026-06-15 20:10:04.405+05:30	2026-06-15 20:10:04.405+05:30	/api/media/file/69e8d06c5e4142c3d43a6b06_WhatsApp%20Image%202026-04-17%20at%2010.20.38%20AM-p-1080.jpeg	\N	69e8d06c5e4142c3d43a6b06_WhatsApp Image 2026-04-17 at 10.20.38 AM-p-1080.jpeg	image/jpeg	112768	1080	720	50	50
74	nn	2026-06-15 20:10:04.448+05:30	2026-06-15 20:10:04.448+05:30	/api/media/file/69e8d06c12af71c81c76988d_WhatsApp%20Image%202026-04-17%20at%2010.20.27%20AM-p-1080.jpeg	\N	69e8d06c12af71c81c76988d_WhatsApp Image 2026-04-17 at 10.20.27 AM-p-1080.jpeg	image/jpeg	87877	1080	720	50	50
75	nn	2026-06-15 20:10:04.495+05:30	2026-06-15 20:10:04.495+05:30	/api/media/file/69e8d06c21505aee1b850bc6_WhatsApp%20Image%202026-04-17%20at%2010.21.02%20AM-p-1080.jpeg	\N	69e8d06c21505aee1b850bc6_WhatsApp Image 2026-04-17 at 10.21.02 AM-p-1080.jpeg	image/jpeg	128752	1080	720	50	50
76	..	2026-06-15 20:29:28.014+05:30	2026-06-15 20:29:28.014+05:30	/api/media/file/69c52b1541c9351f42799a89_MASTERDWS3%20-8TH%20FLOOR.jpg	\N	69c52b1541c9351f42799a89_MASTERDWS3 -8TH FLOOR.jpg	image/jpeg	525743	1380	928	50	50
77	..	2026-06-15 20:39:01.407+05:30	2026-06-15 20:39:01.406+05:30	/api/media/file/69c52b1541c9351f42799a89_MASTERDWS3%20-8TH%20FLOOR-1.jpg	\N	69c52b1541c9351f42799a89_MASTERDWS3 -8TH FLOOR-1.jpg	image/jpeg	223604	1380	790	50	50
78	,,	2026-06-15 20:39:01.46+05:30	2026-06-15 20:39:01.459+05:30	/api/media/file/69c52b164ad5c6fe8c13631d_CONFERENCE%20ROOM%201-8TH%20FLOOR.png-p-1080.jpg	\N	69c52b164ad5c6fe8c13631d_CONFERENCE ROOM 1-8TH FLOOR.png-p-1080.jpg	image/jpeg	142295	1073	664	50	50
79	..	2026-06-15 20:39:01.505+05:30	2026-06-15 20:39:01.505+05:30	/api/media/file/69c52b16107ee154e72c908a_CONFERENCE%20ROOM%202-8TH%20FLOOR.png-p-1080.jpg	\N	69c52b16107ee154e72c908a_CONFERENCE ROOM 2-8TH FLOOR.png-p-1080.jpg	image/jpeg	113820	1080	647	50	50
80	,,	2026-06-15 20:39:01.561+05:30	2026-06-15 20:39:01.56+05:30	/api/media/file/69c52b16334a0fae0cf687fc_EXECUTIVE1-8THFLOOR.png-p-1080.jpg	\N	69c52b16334a0fae0cf687fc_EXECUTIVE1-8THFLOOR.png-p-1080.jpg	image/jpeg	137206	1080	669	50	50
81	,,	2026-06-15 20:39:01.704+05:30	2026-06-15 20:39:01.704+05:30	/api/media/file/69c52b15c7d153587be8a40e_EXECUTIVE2-8THFLOOR.png-p-1080.jpg	\N	69c52b15c7d153587be8a40e_EXECUTIVE2-8THFLOOR.png-p-1080.jpg	image/jpeg	138497	1080	669	50	50
82	,,	2026-06-15 20:39:01.745+05:30	2026-06-15 20:39:01.745+05:30	/api/media/file/69c52b1553911fcef8a9c2f2_EXECUTIVE3-8THFLOOR.png-p-1080.jpg	\N	69c52b1553911fcef8a9c2f2_EXECUTIVE3-8THFLOOR.png-p-1080.jpg	image/jpeg	138520	1080	665	50	50
83	,,	2026-06-15 20:39:01.786+05:30	2026-06-15 20:39:01.786+05:30	/api/media/file/69c52b155d36dfee8c164e82_MASTERDWS%20-8TH%20FLOOR-p-1080.jpg	\N	69c52b155d36dfee8c164e82_MASTERDWS -8TH FLOOR-p-1080.jpg	image/jpeg	172761	1080	663	50	50
84	,,	2026-06-15 20:39:01.827+05:30	2026-06-15 20:39:01.827+05:30	/api/media/file/69c52b15c492d40e3520fb94_MASTERDWS2%20-8TH%20FLOOR-p-1080.jpg	\N	69c52b15c492d40e3520fb94_MASTERDWS2 -8TH FLOOR-p-1080.jpg	image/jpeg	158135	1079	669	50	50
85	,,	2026-06-15 20:39:01.87+05:30	2026-06-15 20:39:01.869+05:30	/api/media/file/69c52b1565f1363559ec85cd_WS%20-8TH%20FLOOR-p-1080.jpg	\N	69c52b1565f1363559ec85cd_WS -8TH FLOOR-p-1080.jpg	image/jpeg	174392	1080	650	50	50
86	,,	2026-06-15 20:39:01.911+05:30	2026-06-15 20:39:01.911+05:30	/api/media/file/69c52b15f6f75e5ea40353d9_WS3%20-8TH%20FLOOR-p-1080.jpg	\N	69c52b15f6f75e5ea40353d9_WS3 -8TH FLOOR-p-1080.jpg	image/jpeg	164182	1066	639	50	50
87	..	2026-06-15 21:51:13.307+05:30	2026-06-15 21:51:13.306+05:30	/api/media/file/69c52a42436023c32b5e55dc_SEATING%20-9TH%20FLOOR.jpg	\N	69c52a42436023c32b5e55dc_SEATING -9TH FLOOR.jpg	image/jpeg	1506221	3840	2581	50	50
88	..	2026-06-15 21:55:31.42+05:30	2026-06-15 21:55:31.418+05:30	/api/media/file/69c52a42436023c32b5e55dc_SEATING%20-9TH%20FLOOR-1.jpg	\N	69c52a42436023c32b5e55dc_SEATING -9TH FLOOR-1.jpg	image/jpeg	1510764	3840	2324	50	50
89	..	2026-06-15 22:45:25.599+05:30	2026-06-15 22:45:25.598+05:30	/api/media/file/69c52a423c060332141895d0_CONFERENNCE%209TH%20FLOOR%20(2).jpeg-p-1080.jpg	\N	69c52a423c060332141895d0_CONFERENNCE 9TH FLOOR (2).jpeg-p-1080.jpg	image/jpeg	132654	1080	635	50	50
90	..	2026-06-15 22:45:25.674+05:30	2026-06-15 22:45:25.674+05:30	/api/media/file/69c52a44dc58a8f1113528e6_KITCHEN%209TH%20FLOOR%20(1).png-p-1080.jpg	\N	69c52a44dc58a8f1113528e6_KITCHEN 9TH FLOOR (1).png-p-1080.jpg	image/jpeg	140288	1080	649	50	50
91	..	2026-06-15 22:45:25.748+05:30	2026-06-15 22:45:25.748+05:30	/api/media/file/69c52a42044a044463c81f91_KITCHEN%209TH%20FLOOR%20(2).png-p-1080.jpg	\N	69c52a42044a044463c81f91_KITCHEN 9TH FLOOR (2).png-p-1080.jpg	image/jpeg	123716	1080	659	50	50
92	..	2026-06-15 22:45:25.81+05:30	2026-06-15 22:45:25.81+05:30	/api/media/file/69c52a4237abc3e5f6434020_SAMS%20OFFICE%209TH%20FLOOR%20(1).png-p-1080.jpg	\N	69c52a4237abc3e5f6434020_SAMS OFFICE 9TH FLOOR (1).png-p-1080.jpg	image/jpeg	101457	1074	649	50	50
93	--	2026-06-15 22:45:25.928+05:30	2026-06-15 22:45:25.927+05:30	/api/media/file/69c52a425c00b1f066a6c0dc_SAMS%20OFFICE%209TH%20FLOOR%20(2).png-p-1080.jpg	\N	69c52a425c00b1f066a6c0dc_SAMS OFFICE 9TH FLOOR (2).png-p-1080.jpg	image/jpeg	122274	1080	667	50	50
94	,,	2026-06-15 22:45:25.99+05:30	2026-06-15 22:45:25.99+05:30	/api/media/file/69c52a41c89115c3a48c1b08_SAMS%20OFFICE%209TH%20FLOOR%20(3).png-p-1080.jpg	\N	69c52a41c89115c3a48c1b08_SAMS OFFICE 9TH FLOOR (3).png-p-1080.jpg	image/jpeg	129996	1079	678	50	50
95	..	2026-06-15 22:45:26.06+05:30	2026-06-15 22:45:26.059+05:30	/api/media/file/69c52a415f595aab6f763ac5_WS%20-9THFLOOR%20(1).png-p-1080.jpg	\N	69c52a415f595aab6f763ac5_WS -9THFLOOR (1).png-p-1080.jpg	image/jpeg	173265	1076	651	50	50
96	--	2026-06-15 22:45:26.125+05:30	2026-06-15 22:45:26.125+05:30	/api/media/file/69c52a42a99c599311fdff56_WS%20-9THFLOOR%20(2).png-p-1080.jpg	\N	69c52a42a99c599311fdff56_WS -9THFLOOR (2).png-p-1080.jpg	image/jpeg	211883	1080	665	50	50
97	..	2026-06-15 22:51:03.483+05:30	2026-06-15 22:51:03.478+05:30	/api/media/file/filters_quality(70).webp	\N	filters_quality(70).webp	image/webp	262168	2160	1440	50	50
98	,,	2026-06-15 22:55:37.056+05:30	2026-06-15 22:55:37.056+05:30	/api/media/file/filters_quality(70)%20(9).webp	\N	filters_quality(70) (9).webp	image/webp	81872	1400	1867	50	50
99	,,	2026-06-15 22:55:37.968+05:30	2026-06-15 22:55:37.967+05:30	/api/media/file/filters_quality(70)%20(8).webp	\N	filters_quality(70) (8).webp	image/webp	119358	1400	933	50	50
100	,,	2026-06-15 22:55:38.524+05:30	2026-06-15 22:55:38.524+05:30	/api/media/file/filters_quality(70)%20(7).webp	\N	filters_quality(70) (7).webp	image/webp	123274	1400	934	50	50
101	UU	2026-06-15 22:55:39.823+05:30	2026-06-15 22:55:39.822+05:30	/api/media/file/filters_quality(70)%20(6).webp	\N	filters_quality(70) (6).webp	image/webp	242466	1400	2099	50	50
102	JJ	2026-06-15 22:55:40.62+05:30	2026-06-15 22:55:40.62+05:30	/api/media/file/filters_quality(70)%20(5).webp	\N	filters_quality(70) (5).webp	image/webp	183234	1400	1050	50	50
103	OO	2026-06-15 22:55:41.393+05:30	2026-06-15 22:55:41.392+05:30	/api/media/file/filters_quality(70)%20(5)-1.webp	\N	filters_quality(70) (5)-1.webp	image/webp	183234	1400	1050	50	50
104	--	2026-06-15 22:55:42.329+05:30	2026-06-15 22:55:42.329+05:30	/api/media/file/filters_quality(70)%20(4).webp	\N	filters_quality(70) (4).webp	image/webp	97564	1400	1750	50	50
105	--	2026-06-15 22:55:43.426+05:30	2026-06-15 22:55:43.426+05:30	/api/media/file/filters_quality(70)%20(3).webp	\N	filters_quality(70) (3).webp	image/webp	223972	1400	1867	50	50
106	MM	2026-06-15 22:55:45.479+05:30	2026-06-15 22:55:45.478+05:30	/api/media/file/filters_quality(70)%20(2).webp	\N	filters_quality(70) (2).webp	image/webp	529978	2160	2700	50	50
107	..	2026-06-15 22:55:47.008+05:30	2026-06-15 22:55:47.008+05:30	/api/media/file/filters_quality(70)%20(1).webp	\N	filters_quality(70) (1).webp	image/webp	265714	1400	2099	50	50
108	..	2026-06-15 22:55:48.367+05:30	2026-06-15 22:55:48.367+05:30	/api/media/file/filters_quality(70)-1.webp	\N	filters_quality(70)-1.webp	image/webp	262168	2160	1440	50	50
109	....	2026-06-15 23:24:22.808+05:30	2026-06-15 23:24:22.808+05:30	/api/media/file/01_Lobby-A_P5-4k.webp	\N	01_Lobby-A_P5-4k.webp	image/webp	241594	1920	1080	50	50
110	..	2026-06-15 23:28:29.557+05:30	2026-06-15 23:28:29.554+05:30	/api/media/file/14_Deluxe-Queen-Bedroom-B_R3_4K.webp	\N	14_Deluxe-Queen-Bedroom-B_R3_4K.webp	image/webp	271512	1920	1599	50	50
111	..	2026-06-15 23:28:30.397+05:30	2026-06-15 23:28:30.396+05:30	/api/media/file/13_Deluxe-Queen-Bedroom-A_R3_4K.webp	\N	13_Deluxe-Queen-Bedroom-A_R3_4K.webp	image/webp	154824	1920	1080	50	50
112	,,	2026-06-15 23:28:31.033+05:30	2026-06-15 23:28:31.033+05:30	/api/media/file/06_Fitness-Center_R3_4K.webp	\N	06_Fitness-Center_R3_4K.webp	image/webp	128896	1920	533	50	50
113	ll	2026-06-15 23:28:32.083+05:30	2026-06-15 23:28:32.083+05:30	/api/media/file/07_Bar-FB_R3_4K.webp	\N	07_Bar-FB_R3_4K.webp	image/webp	319738	1920	1080	50	50
114	,,	2026-06-15 23:28:33.046+05:30	2026-06-15 23:28:33.046+05:30	/api/media/file/08_Courtyard_R3_4K.webp	\N	08_Courtyard_R3_4K.webp	image/webp	233896	1296	1080	50	50
115	ll	2026-06-15 23:28:34.228+05:30	2026-06-15 23:28:34.193+05:30	/api/media/file/02_Lobby-B_P5-4k.webp	\N	02_Lobby-B_P5-4k.webp	image/webp	192374	1920	1080	50	50
116	oo	2026-06-15 23:28:35.286+05:30	2026-06-15 23:28:35.286+05:30	/api/media/file/04_Lobby-D_P5-4k.webp	\N	04_Lobby-D_P5-4k.webp	image/webp	194958	1920	914	50	50
117	..	2026-06-15 23:28:36.617+05:30	2026-06-15 23:28:36.617+05:30	/api/media/file/01_Lobby-A_P5-4k-1.webp	\N	01_Lobby-A_P5-4k-1.webp	image/webp	241594	1920	1080	50	50
118	..	2026-06-16 00:15:01.327+05:30	2026-06-16 00:15:01.325+05:30	/api/media/file/3773-MasterXX.webp	\N	3773-MasterXX.webp	image/webp	214782	1607	1066	50	50
119	..	2026-06-16 00:22:26.096+05:30	2026-06-16 00:22:26.096+05:30	/api/media/file/CALO-SCP-pdr.webp	\N	CALO-SCP-pdr.webp	image/webp	181346	1920	1080	50	50
120	nn	2026-06-16 00:22:26.402+05:30	2026-06-16 00:22:26.402+05:30	/api/media/file/CALO-SCP-pdr-entry-option.webp	\N	CALO-SCP-pdr-entry-option.webp	image/webp	182278	1411	942	50	50
121	nn	2026-06-16 00:22:26.761+05:30	2026-06-16 00:22:26.761+05:30	/api/media/file/6734-MasterXX.webp	\N	6734-MasterXX.webp	image/webp	282038	1536	1024	50	50
122	00	2026-06-16 00:22:27.115+05:30	2026-06-16 00:22:27.115+05:30	/api/media/file/6955-MasterX_edited.webp	\N	6955-MasterX_edited.webp	image/webp	300404	1037	1494	50	50
123	mm	2026-06-16 00:22:27.461+05:30	2026-06-16 00:22:27.461+05:30	/api/media/file/3350-MasterXX.webp	\N	3350-MasterXX.webp	image/webp	196480	1613	1075	50	50
124	oo	2026-06-16 00:22:27.862+05:30	2026-06-16 00:22:27.862+05:30	/api/media/file/3580-MasterXX.webp	\N	3580-MasterXX.webp	image/webp	141790	1536	1024	50	50
125	nn	2026-06-16 00:22:28.29+05:30	2026-06-16 00:22:28.288+05:30	/api/media/file/3754-MasterXX.webp	\N	3754-MasterXX.webp	image/webp	68726	1536	1024	50	50
126	nn	2026-06-16 00:22:28.663+05:30	2026-06-16 00:22:28.663+05:30	/api/media/file/3331-MasterAXX.webp	\N	3331-MasterAXX.webp	image/webp	198566	1075	1613	50	50
127	ii	2026-06-16 00:22:29.078+05:30	2026-06-16 00:22:29.078+05:30	/api/media/file/C5-scaled-1.webp	\N	C5-scaled-1.webp	image/webp	286338	1920	1080	50	50
128	oo	2026-06-16 00:22:29.478+05:30	2026-06-16 00:22:29.478+05:30	/api/media/file/3773-MasterXX-1.webp	\N	3773-MasterXX-1.webp	image/webp	214782	1607	1066	50	50
129	..	2026-06-16 00:43:36.509+05:30	2026-06-16 00:43:36.509+05:30	/api/media/file/AC_SEAAR_Bellevue_Front%2BDesk.webp	\N	AC_SEAAR_Bellevue_Front+Desk.webp	image/webp	126700	2158	1440	50	50
130	,,	2026-06-16 00:48:09.693+05:30	2026-06-16 00:48:09.692+05:30	/api/media/file/image-asset.webp	\N	image-asset.webp	image/webp	100336	1179	788	50	50
131	mm	2026-06-16 00:48:09.908+05:30	2026-06-16 00:48:09.908+05:30	/api/media/file/AC_SEAAR_Bellevue_Detail2.webp	\N	AC_SEAAR_Bellevue_Detail2.webp	image/webp	53068	750	1125	50	50
132	mm	2026-06-16 00:48:10.361+05:30	2026-06-16 00:48:10.361+05:30	/api/media/file/AC_SEAAR_Bellevue_ACKitchen5.webp	\N	AC_SEAAR_Bellevue_ACKitchen5.webp	image/webp	165852	1500	1500	50	50
133	mm	2026-06-16 00:48:10.692+05:30	2026-06-16 00:48:10.692+05:30	/api/media/file/AC_SEAAR_Bellevue_KitchenSeating_1.webp	\N	AC_SEAAR_Bellevue_KitchenSeating_1.webp	image/webp	146816	1309	1309	50	50
134	nn	2026-06-16 00:48:11.115+05:30	2026-06-16 00:48:11.115+05:30	/api/media/file/AC_SEAAR_Bellevue_ACKitchen5-1.webp	\N	AC_SEAAR_Bellevue_ACKitchen5-1.webp	image/webp	165852	1500	1500	50	50
135	nn	2026-06-16 00:48:11.821+05:30	2026-06-16 00:48:11.821+05:30	/api/media/file/AC_SEAAR_Bellevue_Bar_Lounge.webp	\N	AC_SEAAR_Bellevue_Bar_Lounge.webp	image/webp	258036	2500	1667	50	50
136	nn	2026-06-16 00:48:11.972+05:30	2026-06-16 00:48:11.972+05:30	/api/media/file/AC_SEAAR_Bellevue_Bar2.webp	\N	AC_SEAAR_Bellevue_Bar2.webp	image/webp	27486	750	749	50	50
137	nn	2026-06-16 00:48:12.127+05:30	2026-06-16 00:48:12.127+05:30	/api/media/file/AC_SEAAR_Bellevue_PDR_Social_2.webp	\N	AC_SEAAR_Bellevue_PDR_Social_2.webp	image/webp	60750	750	750	50	50
138	nn	2026-06-16 00:48:12.291+05:30	2026-06-16 00:48:12.291+05:30	/api/media/file/AC_SEAAR_Bellevue_Front%2BDesk3.webp	\N	AC_SEAAR_Bellevue_Front+Desk3.webp	image/webp	42726	750	782	50	50
139	mmm	2026-06-16 00:48:12.813+05:30	2026-06-16 00:48:12.813+05:30	/api/media/file/AC_SEAAR_Bellevue_Entrance.webp	\N	AC_SEAAR_Bellevue_Entrance.webp	image/webp	350338	1500	1500	50	50
140	..	2026-06-16 08:45:56.621+05:30	2026-06-16 08:45:56.62+05:30	/api/media/file/AC_ACTAC_front%2Bdesk.webp	\N	AC_ACTAC_front+desk.webp	image/webp	251896	2477	1652	50	50
141	..	2026-06-16 08:50:30.127+05:30	2026-06-16 08:50:30.127+05:30	/api/media/file/AC_ACTAC_front%2Bdesk%20(1).webp	\N	AC_ACTAC_front+desk (1).webp	image/webp	41534	1000	667	50	50
142	..	2026-06-16 08:50:30.958+05:30	2026-06-16 08:50:30.958+05:30	/api/media/file/AC_ACTAC_front%2Bpatio.webp	\N	AC_ACTAC_front+patio.webp	image/webp	246006	1620	1080	50	50
143	nn	2026-06-16 08:50:31.33+05:30	2026-06-16 08:50:31.33+05:30	/api/media/file/AC_ACTAC_entry.webp	\N	AC_ACTAC_entry.webp	image/webp	99342	1000	667	50	50
144	mm	2026-06-16 08:50:32.078+05:30	2026-06-16 08:50:32.078+05:30	/api/media/file/AC_ACTAC_double%2Bqueen%2Bextended.webp	\N	AC_ACTAC_double+queen+extended.webp	image/webp	74076	1670	1080	50	50
145	oo	2026-06-16 08:50:32.451+05:30	2026-06-16 08:50:32.451+05:30	/api/media/file/AC_ACTAC_bath_walk%2Bin%2Bshower.webp	\N	AC_ACTAC_bath_walk+in+shower.webp	image/webp	49782	1000	667	50	50
146	mm	2026-06-16 08:50:32.839+05:30	2026-06-16 08:50:32.839+05:30	/api/media/file/AC_ACTAC_bar_nighttime.webp	\N	AC_ACTAC_bar_nighttime.webp	image/webp	75520	1000	667	50	50
147	mm	2026-06-16 08:50:33.317+05:30	2026-06-16 08:50:33.317+05:30	/api/media/file/AC_ACTAC_banquet%2Bdetail.webp	\N	AC_ACTAC_banquet+detail.webp	image/webp	95832	1000	667	50	50
148	mmm	2026-06-16 08:50:34.229+05:30	2026-06-16 08:50:34.229+05:30	/api/media/file/AC_ACTAC_bar_daytime.webp	\N	AC_ACTAC_bar_daytime.webp	image/webp	172000	1611	1080	50	50
149	..	2026-06-16 08:50:55.691+05:30	2026-06-16 08:50:55.691+05:30	/api/media/file/AC_ACTAC_AC%2BStore.webp	\N	AC_ACTAC_AC+Store.webp	image/webp	70412	1000	667	50	50
150	mm	2026-06-16 08:50:55.994+05:30	2026-06-16 08:50:55.994+05:30	/api/media/file/AC_ACTAC_AC%2BLibrary.webp	\N	AC_ACTAC_AC+Library.webp	image/webp	76898	1000	667	50	50
151	,mm	2026-06-16 08:50:56.349+05:30	2026-06-16 08:50:56.349+05:30	/api/media/file/AC_ACTAC_AC%2BKitchen_seating.webp	\N	AC_ACTAC_AC+Kitchen_seating.webp	image/webp	73034	1000	672	50	50
152	mm	2026-06-16 08:50:57.069+05:30	2026-06-16 08:50:57.068+05:30	/api/media/file/AC_ACTAC_AC%2BKitchen_dining2.webp	\N	AC_ACTAC_AC+Kitchen_dining2.webp	image/webp	112240	1620	1080	50	50
153	..	2026-06-16 10:10:39.4+05:30	2026-06-16 10:10:39.399+05:30	/api/media/file/idx260301_100Stantec_01.webp	\N	idx260301_100Stantec_01.webp	image/webp	104240	1500	1200	50	50
154	,,	2026-06-16 10:11:33.554+05:30	2026-06-16 10:11:33.554+05:30	/api/media/file/idx260301_100Stantec_04-1024x819.jpg	\N	idx260301_100Stantec_04-1024x819.jpg	image/jpeg	188650	1024	819	50	50
155	..	2026-06-16 10:11:33.733+05:30	2026-06-16 10:11:33.733+05:30	/api/media/file/idx260301_100Stantec_03-1024x819.webp	\N	idx260301_100Stantec_03-1024x819.webp	image/webp	68922	1024	819	50	50
156	..	2026-06-16 10:11:33.886+05:30	2026-06-16 10:11:33.886+05:30	/api/media/file/idx260301_100Stantec_02-1024x819.webp	\N	idx260301_100Stantec_02-1024x819.webp	image/webp	63872	1024	819	50	50
157	..	2026-06-16 10:16:43.608+05:30	2026-06-16 10:16:43.607+05:30	/api/media/file/Metrocare_Mental_Health__Disability_Innovation_Center_2022025_N71-resized.jpg	\N	Metrocare_Mental_Health__Disability_Innovation_Center_2022025_N71-resized.jpg	image/jpeg	411090	1000	550	50	50
158	,,	2026-06-16 10:18:48.858+05:30	2026-06-16 10:18:48.858+05:30	/api/media/file/Metrocare_Mental_Health__Disability_Innovation_Center_2022025_N54-resized.jpg	\N	Metrocare_Mental_Health__Disability_Innovation_Center_2022025_N54-resized.jpg	image/jpeg	391196	1000	550	50	50
159	mm	2026-06-16 10:18:48.928+05:30	2026-06-16 10:18:48.928+05:30	/api/media/file/Metrocare_Mental_Health__Disability_Innovation_Center_2022025_N46-resized.jpg	\N	Metrocare_Mental_Health__Disability_Innovation_Center_2022025_N46-resized.jpg	image/jpeg	424033	1000	550	50	50
160	mm	2026-06-16 10:18:48.991+05:30	2026-06-16 10:18:48.991+05:30	/api/media/file/Metrocare_Mental_Health__Disability_Innovation_Center_2022025_N51-resized.jpg	\N	Metrocare_Mental_Health__Disability_Innovation_Center_2022025_N51-resized.jpg	image/jpeg	257996	550	550	50	50
161	..	2026-06-16 10:28:37.021+05:30	2026-06-16 10:28:37.021+05:30	/api/media/file/67aa8a6ca349f104ea7b7a5a_Children_s_Hospital_Plano_Bed_Tower-2.avif	\N	67aa8a6ca349f104ea7b7a5a_Children_s_Hospital_Plano_Bed_Tower-2.avif	image/avif	65522	1920	1280	50	50
162	mm	2026-06-16 10:28:48.087+05:30	2026-06-16 10:28:48.087+05:30	/api/media/file/67d1d6fbb206399af89e64eb_Children_s_Hospital_Plano_Bed_Tower-2.avif	\N	67d1d6fbb206399af89e64eb_Children_s_Hospital_Plano_Bed_Tower-2.avif	image/avif	100347	1920	1280	50	50
163	mm	2026-06-16 10:28:57.616+05:30	2026-06-16 10:28:57.616+05:30	/api/media/file/67d1d6f2bb0be2da3b03a19d_Children_s_Hospital_Plano_Bed_Tower-4.avif	\N	67d1d6f2bb0be2da3b03a19d_Children_s_Hospital_Plano_Bed_Tower-4.avif	image/avif	166070	1920	1414	50	50
164	,,	2026-06-16 13:38:03.804+05:30	2026-06-16 13:38:03.801+05:30	/api/media/file/ntc-18.webp	\N	ntc-18.webp	image/webp	154976	1918	1279	50	50
165	mm	2026-06-16 13:39:01.667+05:30	2026-06-16 13:39:01.667+05:30	/api/media/file/NTC-12.webp	\N	NTC-12.webp	image/webp	103726	2664	1776	50	50
166	nn	2026-06-16 13:39:02.64+05:30	2026-06-16 13:39:02.64+05:30	/api/media/file/NTC-13.webp	\N	NTC-13.webp	image/webp	199506	2664	1776	50	50
167	nn	2026-06-16 13:39:03.568+05:30	2026-06-16 13:39:03.568+05:30	/api/media/file/NTC-17.webp	\N	NTC-17.webp	image/webp	195576	2664	1776	50	50
168	nn	2026-06-16 13:39:05.043+05:30	2026-06-16 13:39:05.043+05:30	/api/media/file/NTC-16.webp	\N	NTC-16.webp	image/webp	274876	2664	1776	50	50
169	..	2026-06-16 13:39:06.627+05:30	2026-06-16 13:39:06.627+05:30	/api/media/file/NTC-15.webp	\N	NTC-15.webp	image/webp	192974	2664	1776	50	50
170	..	2026-06-16 20:01:11.168+05:30	2026-06-16 20:01:11.167+05:30	/api/media/file/idx260301_Rising_Mazzarini_03.webp	\N	idx260301_Rising_Mazzarini_03.webp	image/webp	94422	1500	1125	50	50
171	..	2026-06-16 20:03:37.884+05:30	2026-06-16 20:03:37.883+05:30	/api/media/file/idx260301_Rising_Mazzarini_02-1024x768.jpg	\N	idx260301_Rising_Mazzarini_02-1024x768.jpg	image/jpeg	148792	1024	768	50	50
172	,,	2026-06-16 20:03:37.982+05:30	2026-06-16 20:03:37.982+05:30	/api/media/file/idx260301_Rising_Mazzarini_04-1024x768.jpg	\N	idx260301_Rising_Mazzarini_04-1024x768.jpg	image/jpeg	124236	1024	768	50	50
173	mm	2026-06-16 20:03:38.346+05:30	2026-06-16 20:03:38.345+05:30	/api/media/file/idx260301_Rising_Mazzarini_01-768x1024.webp	\N	idx260301_Rising_Mazzarini_01-768x1024.webp	image/webp	67738	768	1024	50	50
174	nn	2026-06-16 20:03:38.723+05:30	2026-06-16 20:03:38.723+05:30	/api/media/file/idx260301_Rising_Mazzarini_05-768x1024.webp	\N	idx260301_Rising_Mazzarini_05-768x1024.webp	image/webp	92580	768	1024	50	50
175	,,	2026-06-16 21:09:33.626+05:30	2026-06-16 21:09:33.626+05:30	/api/media/file/Shaheen%2BLiving%2BRm.webp	\N	Shaheen+Living+Rm.webp	image/webp	439638	2500	1686	50	50
176	,,	2026-06-16 21:51:58.138+05:30	2026-06-16 21:51:58.137+05:30	/api/media/file/photo-1497366216548-37526070297c.jpeg	\N	photo-1497366216548-37526070297c.jpeg	image/jpeg	155888	1400	935	50	50
177	mm	2026-06-16 21:55:08.24+05:30	2026-06-16 21:55:08.24+05:30	/api/media/file/photo-1556761175-5973dc0f32e7.jpeg	\N	photo-1556761175-5973dc0f32e7.jpeg	image/jpeg	257902	1200	675	50	50
178	mm	2026-06-16 21:55:08.344+05:30	2026-06-16 21:55:08.343+05:30	/api/media/file/photo-1577412647305-991150c7d163.jpeg	\N	photo-1577412647305-991150c7d163.jpeg	image/jpeg	148719	1200	800	50	50
179	mm	2026-06-16 21:55:08.489+05:30	2026-06-16 21:55:08.488+05:30	/api/media/file/photo-1604328698692-f76ea9498e76.jpeg	\N	photo-1604328698692-f76ea9498e76.jpeg	image/jpeg	227625	1200	800	50	50
180	mm	2026-06-16 21:55:08.566+05:30	2026-06-16 21:55:08.566+05:30	/api/media/file/photo-1568992687947-868a62a9f521.jpeg	\N	photo-1568992687947-868a62a9f521.jpeg	image/jpeg	145824	1200	675	50	50
181	mm	2026-06-16 21:55:08.652+05:30	2026-06-16 21:55:08.652+05:30	/api/media/file/photo-1524758631624-e2822e304c36.jpeg	\N	photo-1524758631624-e2822e304c36.jpeg	image/jpeg	159643	1200	800	50	50
182	,,,	2026-06-16 22:08:54.033+05:30	2026-06-16 22:08:54.033+05:30	/api/media/file/1548c3fcce154a5869f5fe8d39e0818d.webp	\N	1548c3fcce154a5869f5fe8d39e0818d.webp	image/webp	210062	1200	900	50	50
183	,,	2026-06-16 22:09:17.692+05:30	2026-06-16 22:09:17.692+05:30	/api/media/file/6a228de8a63a0aec51fec22be4e7e467.webp	\N	6a228de8a63a0aec51fec22be4e7e467.webp	image/webp	56848	968	1176	50	50
184	,,	2026-06-16 22:09:18.214+05:30	2026-06-16 22:09:18.213+05:30	/api/media/file/a382ded7e1f267170c3a7ec3be483f0e.webp	\N	a382ded7e1f267170c3a7ec3be483f0e.webp	image/webp	113390	735	894	50	50
185	mm	2026-06-16 22:12:11.576+05:30	2026-06-16 22:12:11.575+05:30	/api/media/file/photo-1497366811353-6870744d04b2.jpeg	\N	photo-1497366811353-6870744d04b2.jpeg	image/jpeg	212059	1400	935	50	50
186	,,	2026-06-16 22:24:42.952+05:30	2026-06-16 22:24:42.946+05:30	/api/media/file/office_2.png	\N	office_2.png	image/png	558356	699	404	50	50
187	..	2026-06-16 22:33:12.241+05:30	2026-06-16 22:33:12.241+05:30	/api/media/file/office_2-1.png	\N	office_2-1.png	image/png	558356	699	404	50	50
188	,,	2026-06-16 22:34:25.992+05:30	2026-06-16 22:34:25.992+05:30	/api/media/file/office_15.png	\N	office_15.png	image/png	612387	699	404	50	50
189	ll	2026-06-16 22:34:26.055+05:30	2026-06-16 22:34:26.055+05:30	/api/media/file/office_14.png	\N	office_14.png	image/png	505716	699	404	50	50
190	nn	2026-06-16 22:34:26.117+05:30	2026-06-16 22:34:26.117+05:30	/api/media/file/office_12.png	\N	office_12.png	image/png	493387	699	404	50	50
191	,,	2026-06-16 22:34:26.184+05:30	2026-06-16 22:34:26.184+05:30	/api/media/file/office_11.png	\N	office_11.png	image/png	545868	699	404	50	50
192	nn	2026-06-16 22:34:26.232+05:30	2026-06-16 22:34:26.232+05:30	/api/media/file/office_10.png	\N	office_10.png	image/png	542892	699	404	50	50
193	nn	2026-06-16 22:34:26.283+05:30	2026-06-16 22:34:26.283+05:30	/api/media/file/office_8.png	\N	office_8.png	image/png	559826	699	404	50	50
194	nn	2026-06-16 22:34:26.328+05:30	2026-06-16 22:34:26.328+05:30	/api/media/file/office_7.png	\N	office_7.png	image/png	511655	699	404	50	50
195	mm	2026-06-16 22:34:26.384+05:30	2026-06-16 22:34:26.384+05:30	/api/media/file/office_6.png	\N	office_6.png	image/png	576532	699	404	50	50
196	,,	2026-06-16 22:38:02.493+05:30	2026-06-16 22:38:02.493+05:30	/api/media/file/designer-studio-16.jpg	\N	designer-studio-16.jpg	image/jpeg	620908	640	960	50	50
197	,,	2026-06-16 22:38:54.94+05:30	2026-06-16 22:38:54.94+05:30	/api/media/file/natural-lighting%20(1).jpg	\N	natural-lighting (1).jpg	image/jpeg	299829	1280	853	50	50
198	,,	2026-06-16 22:38:55.014+05:30	2026-06-16 22:38:55.014+05:30	/api/media/file/designer-studio-8.jpg	\N	designer-studio-8.jpg	image/jpeg	1282678	1440	960	50	50
199	,,	2026-06-16 22:38:55.087+05:30	2026-06-16 22:38:55.087+05:30	/api/media/file/designer-studio-14.jpg	\N	designer-studio-14.jpg	image/jpeg	1526738	1440	960	50	50
200	,,	2026-06-16 22:38:55.158+05:30	2026-06-16 22:38:55.158+05:30	/api/media/file/designer-studio-17.jpg	\N	designer-studio-17.jpg	image/jpeg	1274166	1440	960	50	50
201	mm	2026-06-16 22:38:55.268+05:30	2026-06-16 22:38:55.268+05:30	/api/media/file/designer-studio-10.jpg	\N	designer-studio-10.jpg	image/jpeg	1507213	1440	960	50	50
202	nn	2026-06-16 22:38:55.308+05:30	2026-06-16 22:38:55.308+05:30	/api/media/file/natural-lighting.jpg	\N	natural-lighting.jpg	image/jpeg	299829	1280	853	50	50
203	nn	2026-06-16 22:38:55.35+05:30	2026-06-16 22:38:55.349+05:30	/api/media/file/natural-lighting-1024x682.jpg	\N	natural-lighting-1024x682.jpg	image/jpeg	145008	1024	682	50	50
204	mm	2026-06-16 22:43:37.021+05:30	2026-06-16 22:43:37.021+05:30	/api/media/file/penthouse-design-17.jpg	\N	penthouse-design-17.jpg	image/jpeg	1059299	1440	960	50	50
205	,,	2026-06-16 22:48:05.382+05:30	2026-06-16 22:48:05.382+05:30	/api/media/file/penthouse-design-34.jpg	\N	penthouse-design-34.jpg	image/jpeg	966925	1440	960	50	50
206	,,	2026-06-16 22:48:05.473+05:30	2026-06-16 22:48:05.473+05:30	/api/media/file/penthouse-design-6.jpg	\N	penthouse-design-6.jpg	image/jpeg	672354	640	960	50	50
207	,,	2026-06-16 22:48:05.533+05:30	2026-06-16 22:48:05.532+05:30	/api/media/file/penthouse-design-1.jpg	\N	penthouse-design-1.jpg	image/jpeg	604761	640	960	50	50
208	mm	2026-06-16 22:48:05.578+05:30	2026-06-16 22:48:05.578+05:30	/api/media/file/penthouse-design-10.jpg	\N	penthouse-design-10.jpg	image/jpeg	475648	640	960	50	50
209	mm	2026-06-16 22:48:05.632+05:30	2026-06-16 22:48:05.632+05:30	/api/media/file/penthouse-design-12.jpg	\N	penthouse-design-12.jpg	image/jpeg	543858	640	960	50	50
210	nn	2026-06-16 22:48:05.701+05:30	2026-06-16 22:48:05.701+05:30	/api/media/file/penthouse-design-7.jpg	\N	penthouse-design-7.jpg	image/jpeg	1123367	1440	960	50	50
211	nn	2026-06-16 22:48:05.762+05:30	2026-06-16 22:48:05.762+05:30	/api/media/file/penthouse-design-16.jpg	\N	penthouse-design-16.jpg	image/jpeg	1188288	1440	960	50	50
212	nn	2026-06-16 22:48:05.808+05:30	2026-06-16 22:48:05.808+05:30	/api/media/file/penthouse-design-14.jpg	\N	penthouse-design-14.jpg	image/jpeg	636738	640	960	50	50
213	ii	2026-06-16 22:48:05.86+05:30	2026-06-16 22:48:05.86+05:30	/api/media/file/penthouse-design-33.jpg	\N	penthouse-design-33.jpg	image/jpeg	1071895	1440	960	50	50
214	ii	2026-06-16 22:48:05.946+05:30	2026-06-16 22:48:05.946+05:30	/api/media/file/penthouse-design-21.jpg	\N	penthouse-design-21.jpg	image/jpeg	1109236	1440	960	50	50
215	ii	2026-06-16 22:48:06.052+05:30	2026-06-16 22:48:06.052+05:30	/api/media/file/penthouse-design-1024x768%20(1).png	\N	penthouse-design-1024x768 (1).png	image/png	952777	1024	768	50	50
216	jj	2026-06-16 22:48:06.171+05:30	2026-06-16 22:48:06.171+05:30	/api/media/file/penthouse-design-1024x768.png	\N	penthouse-design-1024x768.png	image/png	952777	1024	768	50	50
217	,,	2026-06-17 09:13:32.884+05:30	2026-06-17 09:13:32.883+05:30	/api/media/file/Harajuku-Tokyo-Cafe-5.webp	\N	Harajuku-Tokyo-Cafe-5.webp	image/webp	106792	1200	718	50	50
218	,,	2026-06-17 09:14:24.356+05:30	2026-06-17 09:14:24.355+05:30	/api/media/file/Harajuku-Tokyo-Cafe-4-1-scaled%20(1).webp	\N	Harajuku-Tokyo-Cafe-4-1-scaled (1).webp	image/webp	321976	1600	1067	50	50
219	,,	2026-06-17 09:14:25.036+05:30	2026-06-17 09:14:25.035+05:30	/api/media/file/Harajuku-Tokyo-Cafe-6-scaled.webp	\N	Harajuku-Tokyo-Cafe-6-scaled.webp	image/webp	200472	1600	1067	50	50
220	..	2026-06-17 09:14:25.801+05:30	2026-06-17 09:14:25.8+05:30	/api/media/file/Harajuku-Tokyo-Cafe-2-scaled.webp	\N	Harajuku-Tokyo-Cafe-2-scaled.webp	image/webp	229012	1600	1067	50	50
221	mm	2026-06-17 09:14:26.114+05:30	2026-06-17 09:14:26.114+05:30	/api/media/file/03.webp	\N	03.webp	image/webp	90486	800	533	50	50
222	mm	2026-06-17 09:14:26.395+05:30	2026-06-17 09:14:26.394+05:30	/api/media/file/01.webp	\N	01.webp	image/webp	106324	800	533	50	50
223	mm	2026-06-17 09:14:26.506+05:30	2026-06-17 09:14:26.506+05:30	/api/media/file/Harajuku-Tokyo-Cafe-4-1-scaled.jpg	\N	Harajuku-Tokyo-Cafe-4-1-scaled.jpg	image/jpeg	442169	1600	1067	50	50
224	..	2026-06-17 09:18:05.405+05:30	2026-06-17 09:18:05.404+05:30	/api/media/file/Amaris-Hyderabad.webp	\N	Amaris-Hyderabad.webp	image/webp	38166	800	533	50	50
225	,,	2026-06-17 09:21:54.272+05:30	2026-06-17 09:21:54.271+05:30	/api/media/file/Amaris-10.webp	\N	Amaris-10.webp	image/webp	17840	898	461	50	50
226	,,	2026-06-17 09:21:54.503+05:30	2026-06-17 09:21:54.503+05:30	/api/media/file/Amaris-9.webp	\N	Amaris-9.webp	image/webp	30240	614	514	50	50
227	,,	2026-06-17 09:21:54.72+05:30	2026-06-17 09:21:54.72+05:30	/api/media/file/Amaris-8.webp	\N	Amaris-8.webp	image/webp	21056	801	485	50	50
228	,,	2026-06-17 09:21:54.927+05:30	2026-06-17 09:21:54.927+05:30	/api/media/file/Amaris-6.webp	\N	Amaris-6.webp	image/webp	13320	470	521	50	50
229	,,	2026-06-17 09:21:55.088+05:30	2026-06-17 09:21:55.088+05:30	/api/media/file/Amaris-5.webp	\N	Amaris-5.webp	image/webp	24460	411	489	50	50
230	,,	2026-06-17 09:21:55.313+05:30	2026-06-17 09:21:55.313+05:30	/api/media/file/Amaris-4.webp	\N	Amaris-4.webp	image/webp	45818	790	465	50	50
231	,,	2026-06-17 09:21:55.463+05:30	2026-06-17 09:21:55.463+05:30	/api/media/file/Amaris-3.webp	\N	Amaris-3.webp	image/webp	25124	419	487	50	50
232	,,	2026-06-17 09:21:55.727+05:30	2026-06-17 09:21:55.726+05:30	/api/media/file/Amaris-2.webp	\N	Amaris-2.webp	image/webp	50498	944	457	50	50
233	,,	2026-06-17 12:51:04.412+05:30	2026-06-17 12:51:04.407+05:30	/api/media/file/cam_04_Livng.jpg	\N	cam_04_Livng.jpg	image/jpeg	336612	1000	500	50	50
234	,,	2026-06-17 12:54:21.913+05:30	2026-06-17 12:54:21.913+05:30	/api/media/file/cut_sec_3_bhk__odd_03.JPG	\N	cut_sec_3_bhk__odd_03.JPG	image/jpeg	109554	1500	1125	50	50
235	,,	2026-06-17 12:54:21.999+05:30	2026-06-17 12:54:21.999+05:30	/api/media/file/top_view_01.jpg	\N	top_view_01.jpg	image/jpeg	858094	1200	821	50	50
236	,,	2026-06-17 12:54:22.061+05:30	2026-06-17 12:54:22.061+05:30	/api/media/file/cam_03_04.jpg	\N	cam_03_04.jpg	image/jpeg	323844	1000	500	50	50
237	,,	2026-06-17 12:54:22.123+05:30	2026-06-17 12:54:22.123+05:30	/api/media/file/masterbed01.jpg	\N	masterbed01.jpg	image/jpeg	518342	1200	674	50	50
238	,,	2026-06-17 12:54:22.173+05:30	2026-06-17 12:54:22.173+05:30	/api/media/file/cam02.jpg	\N	cam02.jpg	image/jpeg	857487	1200	943	50	50
239	,,	2026-06-17 13:08:47.386+05:30	2026-06-17 13:08:47.386+05:30	/api/media/file/Villa%20A_A1_01.jpg	\N	Villa A_A1_01.jpg	image/jpeg	632642	2000	1500	50	50
240	..	2026-06-17 13:16:37.586+05:30	2026-06-17 13:16:37.576+05:30	/api/media/file/multiple_villa_04.jpg	\N	multiple_villa_04.jpg	image/jpeg	1599825	2000	1006	50	50
241	..	2026-06-17 13:16:37.744+05:30	2026-06-17 13:16:37.744+05:30	/api/media/file/Type%20C_R1_04.jpg	\N	Type C_R1_04.jpg	image/jpeg	2468701	2000	1251	50	50
242	..	2026-06-17 13:16:37.967+05:30	2026-06-17 13:16:37.967+05:30	/api/media/file/raipur_3bhk%20copy.jpg	\N	raipur_3bhk copy.jpg	image/jpeg	6537084	4000	2400	50	50
243	.	2026-06-17 13:16:38.291+05:30	2026-06-17 13:16:38.291+05:30	/api/media/file/Raipur_2BHK_cam_02_%20copy.jpg	\N	Raipur_2BHK_cam_02_ copy.jpg	image/jpeg	6896025	4000	2134	50	50
244	..	2026-06-17 13:16:38.405+05:30	2026-06-17 13:16:38.405+05:30	/api/media/file/B_Type.jpg	\N	B_Type.jpg	image/jpeg	2511259	2000	1500	50	50
245	..	2026-06-17 13:16:38.561+05:30	2026-06-17 13:16:38.56+05:30	/api/media/file/single%20villaB_04.jpg	\N	single villaB_04.jpg	image/jpeg	2033021	2000	1280	50	50
246	..	2026-06-17 13:32:13.003+05:30	2026-06-17 13:32:12.999+05:30	/api/media/file/Duplex%20living%20room%20view_1.jpg	\N	Duplex living room view_1.jpg	image/jpeg	6331404	4000	2250	50	50
247	,,,	2026-06-17 13:32:35.98+05:30	2026-06-17 13:32:35.979+05:30	/api/media/file/Salisbury_Appartment_Living%20Cam%2006.jpg	\N	Salisbury_Appartment_Living Cam 06.jpg	image/jpeg	4827758	4000	2250	50	50
248	,,	2026-06-17 13:34:34.074+05:30	2026-06-17 13:34:34.073+05:30	/api/media/file/Duplex%20living%20room%20view_2.jpg	\N	Duplex living room view_2.jpg	image/jpeg	5998499	4000	2250	50	50
249	mm	2026-06-17 13:34:34.303+05:30	2026-06-17 13:34:34.303+05:30	/api/media/file/Entrance%20lobby_2.jpg	\N	Entrance lobby_2.jpg	image/jpeg	4253778	4000	2250	50	50
250	mm	2026-06-17 13:34:34.377+05:30	2026-06-17 13:34:34.377+05:30	/api/media/file/duplex006.jpg	\N	duplex006.jpg	image/jpeg	930929	1280	705	50	50
251	,,mm	2026-06-17 13:34:34.489+05:30	2026-06-17 13:34:34.489+05:30	/api/media/file/ravi%20lunavat%20_Terrace%20View_03.jpg	\N	ravi lunavat _Terrace View_03.jpg	image/jpeg	2054164	2000	1125	50	50
252	,,	2026-06-17 13:34:34.642+05:30	2026-06-17 13:34:34.642+05:30	/api/media/file/kitchen.jpg	\N	kitchen.jpg	image/jpeg	4297258	4000	2250	50	50
253	,,	2026-06-17 13:34:34.854+05:30	2026-06-17 13:34:34.854+05:30	/api/media/file/Duplex%20children%20bedroom.jpg	\N	Duplex children bedroom.jpg	image/jpeg	5661484	4000	2250	50	50
254	,,	2026-06-17 13:34:34.979+05:30	2026-06-17 13:34:34.979+05:30	/api/media/file/Salisbury_Appartment_Living%20Cam%2002.jpg	\N	Salisbury_Appartment_Living Cam 02.jpg	image/jpeg	4834276	4000	2250	50	50
255	,,	2026-06-17 13:34:35.272+05:30	2026-06-17 13:34:35.272+05:30	/api/media/file/mbedroom01.jpg	\N	mbedroom01.jpg	image/jpeg	11114185	4000	3637	50	50
256	..	2026-06-17 13:34:35.493+05:30	2026-06-17 13:34:35.493+05:30	/api/media/file/Duplex%20living%20room%20view_1-1.jpg	\N	Duplex living room view_1-1.jpg	image/jpeg	6331404	4000	2250	50	50
257	..	2026-06-17 13:44:41.027+05:30	2026-06-17 13:44:41.026+05:30	/api/media/file/Opulance_penthouse-living%26dinging01.jpg	\N	Opulance_penthouse-living&dinging01.jpg	image/jpeg	725373	4000	2000	50	50
258	..	2026-06-17 13:51:56.098+05:30	2026-06-17 13:51:56.098+05:30	/api/media/file/Opulance_cam02.jpg	\N	Opulance_cam02.jpg	image/jpeg	1393179	3000	2500	50	50
259	mm	2026-06-17 13:51:56.306+05:30	2026-06-17 13:51:56.299+05:30	/api/media/file/Opulance_Cut-section.jpg	\N	Opulance_Cut-section.jpg	image/jpeg	455234	4000	1400	50	50
260	,,	2026-06-17 13:51:56.439+05:30	2026-06-17 13:51:56.439+05:30	/api/media/file/opulance_mbed.jpg	\N	opulance_mbed.jpg	image/jpeg	970493	4000	2400	50	50
261	,,	2026-06-17 13:51:56.597+05:30	2026-06-17 13:51:56.597+05:30	/api/media/file/Opulance_Penthouse_kitchen_media_terreceview0000.jpg	\N	Opulance_Penthouse_kitchen_media_terreceview0000.jpg	image/jpeg	680387	4000	2000	50	50
262	,,	2026-06-17 13:51:56.714+05:30	2026-06-17 13:51:56.714+05:30	/api/media/file/Opulance_living%20room0000.jpg	\N	Opulance_living room0000.jpg	image/jpeg	1254050	4000	3000	50	50
263	,,,	2026-06-17 13:51:57.095+05:30	2026-06-17 13:51:57.095+05:30	/api/media/file/opulance%20cam_01_evening.jpg	\N	opulance cam_01_evening.jpg	image/jpeg	8777139	4000	3333	50	50
264	,,	2026-06-17 13:51:57.225+05:30	2026-06-17 13:51:57.224+05:30	/api/media/file/Opulance_penthouse-living%26dinging01-1.jpg	\N	Opulance_penthouse-living&dinging01-1.jpg	image/jpeg	725373	4000	2000	50	50
265	..	2026-06-17 19:05:54.545+05:30	2026-06-17 19:05:54.544+05:30	/api/media/file/Bilaspur_Dining-living.jpg	\N	Bilaspur_Dining-living.jpg	image/jpeg	3645060	4000	2000	50	50
266	mm	2026-06-17 19:08:27.257+05:30	2026-06-17 19:08:27.257+05:30	/api/media/file/Bilaspur_gate-cam03%20copy.jpg	\N	Bilaspur_gate-cam03 copy.jpg	image/jpeg	7045187	4000	2000	50	50
267	,,	2026-06-17 19:08:27.554+05:30	2026-06-17 19:08:27.554+05:30	/api/media/file/Bilaspur_MBed.jpg	\N	Bilaspur_MBed.jpg	image/jpeg	3781509	4000	2000	50	50
268	mm	2026-06-17 19:08:27.866+05:30	2026-06-17 19:08:27.865+05:30	/api/media/file/Bilaspur_4bhk%20west%20facing%20cam05.jpg	\N	Bilaspur_4bhk west facing cam05.jpg	image/jpeg	5452278	4000	2016	50	50
269	,,	2026-06-17 19:08:28.285+05:30	2026-06-17 19:08:28.285+05:30	/api/media/file/Bilaspur_Street_Image_cam03.jpg	\N	Bilaspur_Street_Image_cam03.jpg	image/jpeg	7144708	4000	2000	50	50
270	mm	2026-06-17 19:08:28.52+05:30	2026-06-17 19:08:28.52+05:30	/api/media/file/Bilaspur_3%20bhk%20copy.jpg	\N	Bilaspur_3 bhk copy.jpg	image/jpeg	5254611	4000	1944	50	50
271	,,	2026-06-17 19:16:04.973+05:30	2026-06-17 19:16:04.971+05:30	/api/media/file/02-final.jpg	\N	02-final.jpg	image/jpeg	573179	960	620	50	50
272	,,,	2026-06-17 19:18:07.01+05:30	2026-06-17 19:18:07.009+05:30	/api/media/file/IMG_1525.JPG	\N	IMG_1525.JPG	image/jpeg	4395908	4368	2912	50	50
273	mm	2026-06-17 19:18:07.485+05:30	2026-06-17 19:18:07.484+05:30	/api/media/file/IMG_1324.JPG	\N	IMG_1324.JPG	image/jpeg	7553799	2912	4368	50	50
274	,,	2026-06-17 19:18:07.698+05:30	2026-06-17 19:18:07.698+05:30	/api/media/file/IMG_1537.JPG	\N	IMG_1537.JPG	image/jpeg	4055747	4368	2912	50	50
275	mm	2026-06-17 19:18:08.026+05:30	2026-06-17 19:18:08.026+05:30	/api/media/file/IMG_1394.JPG	\N	IMG_1394.JPG	image/jpeg	7246049	2912	4368	50	50
276	mm	2026-06-17 19:18:08.235+05:30	2026-06-17 19:18:08.235+05:30	/api/media/file/IMG_1557.JPG	\N	IMG_1557.JPG	image/jpeg	4338507	2912	4368	50	50
277	,,	2026-06-17 19:29:19.348+05:30	2026-06-17 19:29:19.348+05:30	/api/media/file/4%20Bhk_Compact_Living_02_final.tif	\N	4 Bhk_Compact_Living_02_final.tif	image/tiff	45621140	4000	2252	50	50
278	,,	2026-06-17 19:30:56.057+05:30	2026-06-17 19:30:56.057+05:30	/api/media/file/4%20Bhk_Compact_Living_02_final.jpg	\N	4 Bhk_Compact_Living_02_final.jpg	image/jpeg	1573940	4000	2252	50	50
279	,,	2026-06-17 19:39:40.866+05:30	2026-06-17 19:39:40.866+05:30	/api/media/file/logo.png	\N	logo.png	image/png	109698	2103	1001	50	50
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pages (id, hero_headline, hero_subtext, hero_image_id, philosophy_text, seo_title, seo_description, updated_at, created_at) FROM stdin;
1	Where Vision Becomes Space	Two decades of crafting extraordinary interiors for discerning clients across India	278	Architecture is a dialogue between the human spirit and the space it inhabits — we design for the people, not just the photograph	\N	\N	2026-06-17 19:31:10.76+05:30	2026-06-16 21:11:03.614+05:30
\.


--
-- Data for Name: payload_kv; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_kv (id, key, data) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_locked_documents (id, global_slug, updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_locked_documents_rels (id, "order", parent_id, path, users_id, media_id, projects_id, services_id, team_members_id, stats_id, pages_id, inquiries_id) FROM stdin;
\.


--
-- Data for Name: payload_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_migrations (id, name, batch, updated_at, created_at) FROM stdin;
1	dev	-1	2026-06-18 08:30:45.808+05:30	2026-06-09 18:51:47.157+05:30
\.


--
-- Data for Name: payload_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_preferences (id, key, value, updated_at, created_at) FROM stdin;
1	collection-projects	{"limit": 10, "editViewType": "default"}	2026-06-12 00:02:49.666+05:30	2026-06-09 18:55:08.406+05:30
4	collection-team-members	{}	2026-06-12 10:41:56.017+05:30	2026-06-12 10:41:56.016+05:30
5	collection-stats	{}	2026-06-12 10:41:59.373+05:30	2026-06-12 10:41:59.373+05:30
7	collection-inquiries	{}	2026-06-12 10:42:05.359+05:30	2026-06-12 10:42:05.359+05:30
8	nav	{"groups": {"Collections": {"open": true}}}	2026-06-15 18:57:04.484+05:30	2026-06-12 18:38:38.592+05:30
9	collection-users	{}	2026-06-16 09:01:18.136+05:30	2026-06-16 09:01:18.136+05:30
3	collection-media	{"limit": 10, "editViewType": "default"}	2026-06-16 09:01:34.804+05:30	2026-06-09 19:25:32.18+05:30
2	collection-services	{"limit": 10, "editViewType": "default"}	2026-06-16 14:07:07.168+05:30	2026-06-09 18:56:03.605+05:30
6	collection-pages	{"editViewType": "default"}	2026-06-16 21:08:27.644+05:30	2026-06-12 10:42:01.758+05:30
\.


--
-- Data for Name: payload_preferences_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_preferences_rels (id, "order", parent_id, path, users_id) FROM stdin;
5	\N	1	user	1
6	\N	4	user	1
7	\N	5	user	1
9	\N	7	user	1
11	\N	8	user	1
12	\N	9	user	1
13	\N	3	user	1
15	\N	2	user	1
16	\N	6	user	1
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, title, slug, client, location, year, sector, hero_image_id, description, featured, updated_at, created_at, area) FROM stdin;
6	The Mehta Residence	mehta-residence-pune	 Mr. Vikram Mehta	Boat Club Road, Pune	2023	Residential	26	\nThe Mehta Residence\nThe Mehta Residence on Boat Club Road, Pune is a 4,800 sq.ft family home designed for a couple who wanted a home that reflected their journey. Warm ivory plaster, aged teak, hand-cut Jaisalmer stone, and a dramatic floating walnut staircase define this exceptional residence.\n	f	2026-06-16 00:26:27.57+05:30	2026-06-12 11:12:51.591+05:30	\N
2	Spice Nation Restaurant	spcie-nation-resturant	Mr.Prem Chaturvedi	Pune,Maharashtra	2024	Hospitality	2	\nSpice Nation Restaurant in Pune is a fine-dining destination celebrating the richness of Indian culinary culture through bold contemporary interiors. Handcrafted brass fixtures, warm terracotta tones, and dramatic pendant lighting create an atmosphere that is both festive and intimate.\n	f	2026-06-16 00:29:44.743+05:30	2026-06-09 20:15:37.327+05:30	\N
1	Green Home Residence 	green-home	Mr.Sharma	Pune,Maharashtra 	2025	Residential	1	Green Home Residence is a 3,200 sq.ft contemporary family home in Pune designed around the principles of sustainable living and refined comfort. The interiors draw from a palette of natural materials — white oak flooring, handmade Rajasthani tiles, and linen upholstery — that age beautifully and connect the home to its landscape. Open-plan living spaces flow effortlessly to private terraces, blurring the boundary between indoors and outdoors. Custom joinery throughout provides generous storage without visual clutter, while the kitchen — the heart of the home — is designed as a social space as much as a functional one. A home that is as easy to live in as it is beautiful to look at.	f	2026-06-16 00:30:19.343+05:30	2026-06-09 19:27:31.536+05:30	\N
10	The Kapoor Residence	 kapoor-residence-mumbai  	 Mr. & Mrs. Arjun Kapoor  	Juhu, Mumbai	2024	Residential	49	The Kapoor Residence in Juhu, Mumbai is a 5,500 sq.ft seafacing apartment designed for a young entrepreneurial couple. The design balances bold aesthetics with warmth, featuring bleached teak flooring, Calacatta marble surfaces, and floor-to-ceiling glazing with panoramic sea views.	f	2026-06-16 00:33:19.825+05:30	2026-06-12 18:38:59.232+05:30	\N
5	Park Town Hotel	park-town-hotel	park town Pvt Ltd	Mumbai, Maharashtra	2023	Hospitality	129	\nThe Amber Room is Mumbai's most celebrated fine-dining destination — a 5,200 sq.ft sanctuary of warmth, drama, and exceptional cuisine. Aged brass fixtures, hand-blown amber glass pendants, and honey-toned onyx surfaces transform ordinary dining into an immersive sensory event.\n	f	2026-06-16 00:49:00.926+05:30	2026-06-12 11:10:21.129+05:30	\N
4	At Tandem Vet Care	at-tendem-vet-care	Dr.Mehta	Ahmedabad,Gujrat	2023	Healthcare	170		f	2026-06-16 20:03:41.277+05:30	2026-06-12 10:51:41.521+05:30	\N
3	Cafe Delhi Heights	Cafe-delhi-heights	delhi Heights Hospiitality	DLF Avenue, Saket, Delhi	2024	Hospitality	217	\nCafe Arista in Bangalore is a specialty coffee destination designed for the modern urban dweller. Industrial raw elements — exposed concrete ceilings, black steel frames — blend with warm timber shelving and soft leather seating to strike the perfect balance between edge and ease.\n	f	2026-06-17 09:14:44.601+05:30	2026-06-10 14:54:34.553+05:30	\N
13	The Ritz-Carlton Residences	the-ritz-carlton-residences	Ritz Carlton Pvt Ltd	Pune,Maharashtra	2025	Hospitality	97	The Ritz-Carlton Residences is a landmark luxury residential project in the heart of Pune, Maharashtra. Designed for discerning homeowners who expect nothing less than perfection, this 2025 project redefines premium living through meticulous spatial planning, curated material palettes, and an unwavering commitment to craft.\n\nThe interiors draw from a vocabulary of timeless luxury — Carrara marble flooring, custom millwork in figured walnut, hand-applied silk plaster walls, and bespoke furniture pieces sourced from leading European ateliers. Every room has been designed around natural light, with floor-to-ceiling glazing framing panoramic city views.\n\nThe living and dining zones flow seamlessly, anchored by a dramatic double-height ceiling and a sculptural staircase. The master suite features a walk-in dressing room, a spa-quality bathroom with a freestanding soaking tub, and a private terrace. A home that is simply extraordinary.	t	2026-06-16 00:03:30.68+05:30	2026-06-15 22:55:53.274+05:30	\N
12	Upstate House	upstate-house	Dr.Mehta	Mumbai, Maharashtra	2026	Residential	62	Upstate House in Mumbai is a thoughtfully designed residential retreat that balances contemporary aesthetics with warmth and functionality. Every space has been crafted to reflect the lifestyle of its inhabitants, blending comfort, elegance, and personal expression seamlessly.	t	2026-06-16 00:23:10.831+05:30	2026-06-15 20:10:36.77+05:30	\N
7	Home Care HQ	home-care	Home Care HQ Pvt Ltd	Mumbai, Maharashtra	2026	Industrial	76	\nHome Care HQ in Mumbai is a modern commercial workspace designed to foster productivity, collaboration, and brand identity. The interior integrates open collaboration zones, focused work areas, and strong visual touchpoints that reflect the company culture and values.\n	t	2026-06-16 00:25:39.155+05:30	2026-06-12 11:33:07.229+05:30	\N
15	CALŌ Kitchen	calo-kitchen	calo	New	2026	Hospitality	118	Rooted in generations of family tradition, Calo is where the heritage of Jalisco and the tropics of Oaxaca meet the pulse of luxury retail.  We set out to create more than just a restaurant—we crafted an escape. \n\nWarm limestone plasters, carved stone walls, and tropical wallpapers merge Mexico’s arid and lush landscapes, while a wall of bi-folding doors erase the line between indoors and out.  A copper rose sculpture floats above the bar, catching light and glances.  Custom boulder fire features and a purposeful layout preserve intimacy, even in a bustling 200-seat space.  \n\nFrom acoustic buffers to smart patio tech, every detail was designed to transport guests.  The design seduces the senses—sight, sound, scent, texture, and taste—offering weary shoppers a welcome retreat.  \n\nAt Calo, you don’t just dine; you’re carried to a place that feels deeply rooted, richly layered, and unmistakably intentional.  	f	2026-06-16 00:31:22.448+05:30	2026-06-16 00:22:51.664+05:30	\N
14	WESTIN Vacation Club	westin-vacation-club	Westin	Jaipur,Rajasthan 	2025	Hospitality	109	Westin Vacation Club offers a perfect retreat for those looking to relax and explore.  Its central location provides easy access to downtown life, stunning beaches, and lush landscapes.  Rejuvenate your body with restful sleep and nourishing meals and reset your mind by moving your body, having fun and laughing with loved ones.  Immerse oneself in local culture with a horse-drawn carriage ride on cobblestone streets, admire the famous Rainbow Row, and explore the historic City Market.\n\nIn Charleston, you’ll find unmistakable southern hospitality amidst enchanting Spanish moss-covered oak trees, candy-colored buildings, and a unique combination of architectural styles like Greek Revival and Victorian.  This romantic ambiance, often called “southern charm”, is beautifully captured at the Westin Vacation Club, where guests can rejuvenate and create memorable moments.  Here owners and their loved ones can focus on the things that matter most – living well and leaving feeling their best selves.\n\n	f	2026-06-16 00:32:32.631+05:30	2026-06-15 23:28:48.183+05:30	\N
11	Villa Velloze	villa-velloze	villa velloze Pvt Ltd	Villa Velloze Mumbai	2025	Residential	58	Villa Velloze is a luxury private residence in Mumbai designed around the philosophy that a home should be as beautiful as it is liveable. Premium materials, custom joinery, and refined spatial planning come together to create a home of exceptional character and quality.	f	2026-06-16 00:33:00.002+05:30	2026-06-15 19:26:42.926+05:30	\N
16	AC Hotel Waco Downtown	ac-hotel-waco-downtown	Ac Hospitality Pvt Ltd	Hyderabad,Telangana	2026	Hospitality	140	The AC Hotel in Hyderabad,Telangana  features 182 guestrooms and 17,000 SF of conference center space all in a modern and minimalist design that reflects a sleek, professional aesthetic with a focus on comfort and functionality. The interior design incorporates a clean, contemporary style with an emphasis on neutral color palettes, including shades of gray, rust, beige, and white.  	f	2026-06-16 08:51:01.39+05:30	2026-06-16 08:51:01.39+05:30	\N
18	Metrocare Mental Health and Disability Innovation Center	Metrocare -Mental -Health -and -Disability -Innovation Center	MetroCare	Mumbai, Maharashtra	2026	Healthcare	157	\N	f	2026-06-16 10:19:03.392+05:30	2026-06-16 10:19:03.392+05:30	\N
17	Intermountain Primary Children’s Hospital	Intermountain -Primary- Children’s -Hospital	Rebecca Dalzell﻿	New Delhi	2025	Healthcare	153	\N	f	2026-06-16 10:29:02.726+05:30	2026-06-16 10:13:48.519+05:30	\N
19	NIKE Training Club	nike-training -club	Nike	Mumbai, Maharashtra	2024	Retail	164	\N	f	2026-06-16 13:39:09+05:30	2026-06-16 13:39:09+05:30	\N
20	Nexus Co-Working Hub	nexus-coworking-hub 	Nexus Spaces Pvt Ltd	Baner, Pune	2024	Commercial	176	Nexus Co-Working Hub is a premium shared workspace in Baner, Pune designed to feel less like an office and more like a place people choose to spend time. The brief was clear — create an environment that attracts top talent, supports focused work and makes collaboration feel natural.\n\nThe 12,000 sq ft space is organised around three distinct zones: a buzzing open collaborative floor with biophilic elements and flexible furniture, a ring of private focus pods acoustically isolated from the main floor and a hospitality-grade lounge at the entrance that doubles as a client meeting space.\n\nMaterial choices were deliberate and durable — white oak flooring, exposed concrete ceilings with carefully designed acoustic baffles and planting integrated into the workstation clusters. The result is a workspace that is productive, beautiful and genuinely enjoyable to be in.\n\n	f	2026-06-16 21:55:11.657+05:30	2026-06-16 21:55:11.656+05:30	\N
21	Prestige Corporate Tower	prestige-corporate-tower	Prestige Developers Pvt Ltd 	BKC, Mumbai	2024	Commercial	187	Prestige Corporate Tower is a landmark Grade-A office interior across three floors of one of BKC's most prominent commercial addresses. The brief was to create a corporate environment that communicates ambition, attracts international clients and makes every employee feel that they work somewhere exceptional.\n\nThe design language is one of restrained luxury — Nero Marquina marble in the entrance lobby, custom acoustic wall panels in Italian wool, furniture specified from leading European manufacturers and a lighting design that shifts from energising cool-white in work zones to warm amber in collaborative and hospitality areas.\n\nEach floor has its own identity while maintaining a coherent design vocabulary across all three levels. The executive floor at the top features a boardroom with panoramic city views, a private dining room for client entertainment and a terrace garden that serves as an informal meeting space. The reception on each floor is staffed and designed to hotel standards — because first impressions in a corporate environment carry as much weight as they do in hospitality.\n	f	2026-06-16 22:34:49.453+05:30	2026-06-16 22:34:49.453+05:30	\N
22	Nayantara  designer studio	nayantara-designer-studio	Madhav & Piyush	Karnal, Haryana	2025	Retail	196	Nayantara is a bespoke designer studio located in the heart of Karnal, Conceived for a prominent family with a vision to create an Elevated boutique experience. Designed within a compact Footprint of under 900 sq. ft., the project Reimagines the spatial potential of Small-format retail by Prioritizing experience, clarity, and visual depth.	t	2026-06-16 22:39:43.117+05:30	2026-06-16 22:39:43.117+05:30	\N
23	Earthy Penthouse	earthy-penthouse	 Pal Thakkar	 Bhavnagar, Gujarat,	2026	Residential	204	They instantly resonated with the Japanese philosophy”, recalls Pal. “Its warmth, clean restraint, and its ethos that nothing needs to be excessive to feel extraordinary.” And so, across 1,500 square feet of a two-floor penthouse design, she began layering a vision that is at once deeply serene and quietly sensuous. The architect christened the home Fold Abode because, as he conceived it, every element unfolds into the next. Here, forms cascade, nest and reveal themselves gradually. The name became the design concept. The concept became the architecture	f	2026-06-16 22:48:59.539+05:30	2026-06-16 22:48:59.539+05:30	\N
9	Amaris Jewels Store	amaris-jewels-store	JayShiv 	Banjara Hills, Hyderabad	2024	Retail	224	Ora Jewellery Studio in Banjara Hills is a bespoke fine jewellery destination designed as a private gallery rather than a conventional retail store. The philosophy was simple — every piece deserves space, light and silence to be truly appreciated.\n\nThe interior is built around a palette of ivory plaster, honed White Carrara marble and precision LED optics that create a daylight-quality environment at every display point. Custom display cases in museum-grade glass allow 360-degree viewing of each piece without reflections or visual noise.\n\nA private consultation room at the rear — accessible by appointment — is furnished with a single table, two chairs and a velvet-lined presentation surface. It is designed to feel like entering someone's private collection rather than a commercial transaction. The result is a retail environment where the jewellery is always the star.\n\n	f	2026-06-17 09:22:18.858+05:30	2026-06-12 18:30:58.869+05:30	\N
24	Swapnalok Residences	swapnalok-residences	Swapnalok Developers	Khadki, Pune	2010	Residential	233	Swapnalok Residences is a 3BHK residential project in Khadki, Pune designed to maximise space and light in a compact urban footprint. The design focuses on clean lines, warm materials and a spatial efficiency that makes every square foot feel intentional and generous.\n\nThe living room is the heart of the home — an open plan space that flows naturally into the dining area and benefits from large windows that draw in the morning light. Material choices are warm and durable — polished concrete floors, teak veneer panelling and a kitchen finished in high-gloss lacquer with stone countertops.\n\nThe master bedroom is a calm sanctuary with built-in wardrobes, indirect lighting and a compact ensuite finished in natural stone. The 3BHK layout was rethought from first principles to eliminate wasted circulation space and maximise the liveable area for a young family.\n	f	2026-06-17 12:54:24.662+05:30	2026-06-17 12:54:24.66+05:30	3,200 sq ft
25	Swarnabhumi Township 	 swarnabhumi-raipur 	Swarnabhumi Developers 	Raipur, Chhattisgarh 	2021	Residential	239	Swarnabhumi is a large-scale residential township in Raipur offering multiple villa typologies across A, B and C type configurations. The project called for a master planning approach to interior design — creating a coherent design vocabulary across multiple unit types while giving each typology its own distinct character and identity.\n\nType A villas are designed for large families — generous proportions, formal living and dining rooms, a private garden and four bedrooms each with ensuite bathrooms. Type B and C typologies are designed for smaller families and young professionals, with an emphasis on flexible layouts that can adapt as family circumstances change.\n\nLandscaping and exterior design were developed in parallel with the interiors to create a seamless experience from arrival to the private spaces within each home. The result is a township where every resident feels they have received a personalised design — at a scale that makes that genuinely difficult to achieve.	f	2026-06-17 13:16:53.902+05:30	2026-06-17 13:16:53.901+05:30	2,50,000 sq ft
26	Opus — Salisbury Park	 opus-salisbury-park 	  Shalaka Properties 	  Salisbury Park, Pune 	2022	Residential	247	Opus at Salisbury Park is a luxury duplex apartment in one of Pune's most coveted residential addresses. The project spans two floors with living, dining, kitchen, four bedrooms, children's room, terrace and a private entrance lobby.\n\nThe living room is a generous open-plan space that flows seamlessly into the dining area and connects to a lush green terrace wall — bringing nature deep into the interior. White furniture, polished floors and floor-to-ceiling glazing create a sense of light and space that makes the apartment feel far larger than its footprint.\n\nThe duplex kitchen is a professional-grade space with island seating, pendant lighting and direct garden views. The master bedroom is the jewel of the apartment — wood-panelled ceilings, panoramic city views on two sides, a freestanding bathtub and custom wardrobes in high-gloss lacquer.\n\nThe children's bedroom and guest rooms are designed with the same care as the master suite — each with its own character while maintaining the clean, contemporary vocabulary of the overall design. The terrace level provides an outdoor entertaining space that completes the offering.	f	2026-06-17 13:35:19.273+05:30	2026-06-17 13:35:19.267+05:30	8,500 sq ft
27	Polaris — Opulence	polaris-opulence	Eisha Properties	Tathawade, Pune	2024	Residential	257	Polaris Opulence in Tathawade is a premium apartment and penthouse development by Eisha Properties, designed to set a new standard for luxury residential living in the Wakad corridor.\n\nThe penthouse is the centrepiece of the project — a dramatic living room beneath a pitched timber ceiling with floor-to-ceiling glazing that frames panoramic views of the Sahyadri hills. The living and dining spaces flow seamlessly onto a private landscaped terrace, dissolving the boundary between interior and exterior.\n\nEach room is designed with a consistent vocabulary of warm timber, marble floors and carefully considered lighting that shifts from energising during the day to deeply ambient in the evenings. The master bedroom continues this language — generous proportions, custom joinery and views that make waking up here genuinely special.\n\nStandard apartments share the same design sensibility as the penthouse — scaled appropriately but never compromising on material quality or spatial generosity.	f	2026-06-17 13:52:04.76+05:30	2026-06-17 13:52:04.617+05:30	15,000 sq ft
28	Bilaspur Township Villas	bilaspur-township-villas	Rama Real Estate	Bilaspur, Chhattisgarh	2024	Residential	265	Bilaspur Township is a large-scale residential development by Rama Real Estate offering 4BHK villas with club house facilities across a generous site in Bilaspur, Chhattisgarh.\n\nThe 4BHK villas are designed for large families — warm interiors with timber accents, generous master bedrooms with private terraces and garden views, and living spaces that open directly onto landscaped surroundings.\n\nThe master bedroom is particularly well considered — wood panel walls, floor-to-ceiling sliding doors opening onto a private terrace, and a calm natural palette that makes it a genuine retreat. The club house adds a gymnasium, pool and function hall that build community across the development.	f	2026-06-17 19:08:31.5+05:30	2026-06-17 19:08:31.499+05:30	1,80,000 sq ft
29	Acacia Garden Bunglow	acacia-garden-bunglow	Kumar Properties	Hadapsar, Pune	2025	Residential	271	Acacia Garden Bunglow in Hadapsar is one of our few projects where we can show you not just the renders but the finished reality — and we are proud that the two are virtually identical.\n\nThe bunglow sits within a cluster of individually designed residences, each with its own character while sharing a coherent design language of natural stone, warm timber and clean contemporary lines. The dramatic night photographs tell the story best — warm light spilling from every window, the stone facade glowing amber, and a sense of arrival that makes coming home feel genuinely special.\n\nThe ground floor living spaces open directly onto a landscaped garden through large sliding panels — dissolving the boundary between inside and outside. Interiors are warm and natural — stone floors, timber ceilings and a colour palette drawn from the surrounding landscape.	f	2026-06-17 19:18:09.956+05:30	2026-06-17 19:18:09.955+05:30	7,200 sq ft
\.


--
-- Data for Name: projects_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects_rels (id, "order", parent_id, path, media_id) FROM stdin;
153	1	13	gallery	98
154	2	13	gallery	99
155	3	13	gallery	100
156	4	13	gallery	101
157	5	13	gallery	102
158	6	13	gallery	103
159	7	13	gallery	104
160	8	13	gallery	105
161	9	13	gallery	106
239	1	14	gallery	110
240	2	14	gallery	111
241	3	14	gallery	112
242	4	14	gallery	113
243	5	14	gallery	114
162	10	13	gallery	107
163	11	13	gallery	108
244	6	14	gallery	115
245	7	14	gallery	116
246	8	14	gallery	117
247	1	11	gallery	59
248	2	11	gallery	60
249	3	11	gallery	61
250	1	10	gallery	50
251	2	10	gallery	51
252	3	10	gallery	52
253	4	10	gallery	53
254	5	10	gallery	54
255	6	10	gallery	55
256	7	10	gallery	56
257	8	10	gallery	57
258	1	5	gallery	130
259	2	5	gallery	131
260	3	5	gallery	132
261	4	5	gallery	133
262	5	5	gallery	134
263	6	5	gallery	135
264	7	5	gallery	136
265	8	5	gallery	137
266	9	5	gallery	138
174	1	12	gallery	63
175	2	12	gallery	64
267	10	5	gallery	139
268	1	16	gallery	141
269	2	16	gallery	142
270	3	16	gallery	143
176	3	12	gallery	65
177	4	12	gallery	66
178	5	12	gallery	67
179	6	12	gallery	68
180	7	12	gallery	69
181	8	12	gallery	70
182	9	12	gallery	71
183	10	12	gallery	72
184	11	12	gallery	73
185	12	12	gallery	74
186	13	12	gallery	75
271	4	16	gallery	144
272	5	16	gallery	145
273	6	16	gallery	146
274	7	16	gallery	147
275	8	16	gallery	148
276	9	16	gallery	149
277	10	16	gallery	150
278	11	16	gallery	151
279	12	16	gallery	152
283	1	18	gallery	158
284	2	18	gallery	159
285	3	18	gallery	160
286	1	17	gallery	154
287	2	17	gallery	155
288	3	17	gallery	156
289	4	17	gallery	161
290	5	17	gallery	162
291	6	17	gallery	163
292	1	19	gallery	165
293	2	19	gallery	166
294	3	19	gallery	167
295	4	19	gallery	168
296	5	19	gallery	169
297	1	4	gallery	171
298	2	4	gallery	172
299	3	4	gallery	173
300	4	4	gallery	174
301	1	20	gallery	177
302	2	20	gallery	178
303	3	20	gallery	179
194	1	7	gallery	89
195	2	7	gallery	90
196	3	7	gallery	91
197	4	7	gallery	92
198	5	7	gallery	93
199	6	7	gallery	94
200	7	7	gallery	95
201	8	7	gallery	96
202	1	6	gallery	27
203	2	6	gallery	28
304	4	20	gallery	180
305	5	20	gallery	181
311	1	21	gallery	188
312	2	21	gallery	189
313	3	21	gallery	190
314	4	21	gallery	191
204	3	6	gallery	29
205	4	6	gallery	30
206	5	6	gallery	31
221	1	2	gallery	5
222	2	2	gallery	6
223	3	2	gallery	7
224	4	2	gallery	8
225	1	1	gallery	17
226	2	1	gallery	18
227	3	1	gallery	19
228	4	1	gallery	20
229	1	15	gallery	119
230	2	15	gallery	120
231	3	15	gallery	121
232	4	15	gallery	122
233	5	15	gallery	123
234	6	15	gallery	124
235	7	15	gallery	125
236	8	15	gallery	126
237	9	15	gallery	127
238	10	15	gallery	128
315	5	21	gallery	192
316	6	21	gallery	193
317	7	21	gallery	194
318	8	21	gallery	195
319	1	22	gallery	197
320	2	22	gallery	198
321	3	22	gallery	199
322	4	22	gallery	200
323	5	22	gallery	201
324	6	22	gallery	202
325	7	22	gallery	203
326	1	23	gallery	205
327	2	23	gallery	206
328	3	23	gallery	207
329	4	23	gallery	208
330	5	23	gallery	209
331	6	23	gallery	210
332	7	23	gallery	211
333	8	23	gallery	212
334	9	23	gallery	213
335	10	23	gallery	214
336	11	23	gallery	215
337	12	23	gallery	216
343	1	3	gallery	218
344	2	3	gallery	219
345	3	3	gallery	220
346	4	3	gallery	221
347	5	3	gallery	222
348	6	3	gallery	223
349	1	9	gallery	225
350	2	9	gallery	226
351	3	9	gallery	227
352	4	9	gallery	228
353	5	9	gallery	229
354	6	9	gallery	230
355	7	9	gallery	231
356	8	9	gallery	232
357	1	24	gallery	234
358	2	24	gallery	235
359	3	24	gallery	236
360	4	24	gallery	237
361	5	24	gallery	238
362	1	25	gallery	240
363	2	25	gallery	241
364	3	25	gallery	242
365	4	25	gallery	243
366	5	25	gallery	244
367	6	25	gallery	245
368	1	26	gallery	248
369	2	26	gallery	249
370	3	26	gallery	250
371	4	26	gallery	251
372	5	26	gallery	252
373	6	26	gallery	253
374	7	26	gallery	254
375	8	26	gallery	255
376	9	26	gallery	256
377	1	27	gallery	258
378	2	27	gallery	259
379	3	27	gallery	260
380	4	27	gallery	261
381	5	27	gallery	262
382	6	27	gallery	263
383	7	27	gallery	264
384	1	28	gallery	266
385	2	28	gallery	267
386	3	28	gallery	268
387	4	28	gallery	269
388	5	28	gallery	270
389	1	29	gallery	272
390	2	29	gallery	273
391	3	29	gallery	274
392	4	29	gallery	275
393	5	29	gallery	276
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, title, description, icon, "order", updated_at, created_at) FROM stdin;
5	Project Execution	Our on-site supervisors ensure every detail is built exactly as designed	\N	5	2026-06-16 14:09:56.252+05:30	2026-06-16 14:09:56.252+05:30
6	Turnkey Solutions	We deliver the entire interior from concept through to handover with nothing left to chase	\N	6	2026-06-16 14:11:00.346+05:30	2026-06-16 14:11:00.346+05:30
7	3D Visualisation 	Before a single wall is touched you will see your space in photorealistic detail	\N	7	2026-06-16 14:11:46.049+05:30	2026-06-16 14:11:46.049+05:30
8	Lighting Design	We layer ambient, task and accent lighting to create environments that feel extraordinary	\N	8	2026-06-16 14:12:16.951+05:30	2026-06-16 14:12:16.951+05:30
9	Façade Design	Façade DesignWe design exteriors that create anticipation and establish brand identity	\N	9	2026-06-16 14:12:44.168+05:30	2026-06-16 14:12:44.168+05:30
11	Execution Supervision	Dedicated site supervisors ensure workmanship quality from start to handover12Post-Handover SupportWe remain available for snagging, modifications and future phases	\N	11	2026-06-16 14:13:55.133+05:30	2026-06-16 14:13:50.048+05:30
10	Furniture Sourcing 	Furniture SourcingWe source custom and curated furniture that completes the design narrative	\N	10	2026-06-16 14:14:12.372+05:30	2026-06-16 14:13:09.6+05:30
12	Post-Handover Support 	We remain available for snagging, modifications and future phases	\N	\N	2026-06-16 14:14:56.275+05:30	2026-06-16 14:14:56.275+05:30
1	Conceptualization & Design	We translate your brief into a cohesive design concept that balances aesthetics, function and your budget — presented through drawings, mood boards and 3D renders	\N	1	2026-06-16 14:16:41.727+05:30	2026-06-16 14:06:09.357+05:30
2	Project Management	From procurement to contractor coordination, we manage every moving part so you can focus on your business while we deliver your space on time	\N	2	2026-06-16 14:17:18.539+05:30	2026-06-16 14:07:48.334+05:30
3	Material Selection	We source and specify finishes, fixtures and furniture from trusted suppliers — always balancing quality, durability and cost-effectiveness	\N	3	2026-06-16 14:17:59.044+05:30	2026-06-16 14:08:08.935+05:30
4	Network Design	Every space we design is spatially planned from the ground up — optimising flow, natural light, acoustics and the way people actually move through a room	\N	4	2026-06-16 14:18:41.899+05:30	2026-06-16 14:09:03.998+05:30
\.


--
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stats (id, label, value, "order", updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_members (id, name, role, photo_id, bio, "order", updated_at, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, updated_at, created_at, email, reset_password_token, reset_password_expiration, salt, hash, login_attempts, lock_until) FROM stdin;
1	2026-06-09 18:54:07.142+05:30	2026-06-09 18:54:07.14+05:30	harshita.chaturvedi2002@gmail.com	\N	\N	42dc27a78a6ad2bd9d1bd02fcbb5994296d430ac599ee3f7a5eb0590cdf64db9	a880fae2ea814b03f35d00796c2e99be60dcec2afaab41210e9dc568fc1b2a40520a92678ef2523c62e79c257709a3adddfaa5b8dd38722cf126c1929f157b3bdb154ee498effda736f5d7f8ae1a74690a0409b05edbeac6198ce8174746fb9366b25d95c9fb9a7932f5e978b9f5d67912602df49c388476e72ec1a400718e04a95383e4eca00e4bd765e288e0cdfc3a8562b7b6f7df2fda323de6eae349696c9a6e5d48a131a863c25d1d3081be8e4ae82372aa10d50e2a172142cb942160091d62911fd55a5bf7c8abfd44be14f04bffd86fd921cf914362b7a9de0655ef36e2b5732cda2aacd3bb3905aebe71c18ea0f9f4b29cc02118506395d86a2df1f7387ab950563d2c75e03c388e479b64d15fb9490c1eac282c939336fda94c9a4a7cc85472835da993affaad9c29ca799677b6dfd7c8549d6b85d42abf3596c009bb9fff154e1d7011a3c1e4ea812919ea7a0ddf4589a3a0c0c065426370cfbe47f0cf0a45f6459b3ca45d136db1234158f8ff1b0d1aed3c8e0cdfcf6f0abbd42f98382640200f8a5cdc84022d9755600f7be1f20805cbd0f85169f0824c472122f11fcbe1b88f33275ffc933ef4d86d0ceff25c32e148d288800d3c7503b652f35753c70a895ec3fbbe2772af32eb68c7f6edb362d90da12b0bf7af97437bcc9b899bfe116f8bc91dbf38ae829b15bcda41a2f783d410abed3510a7471884a2cf	0	\N
\.


--
-- Data for Name: users_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_sessions (_order, _parent_id, id, created_at, expires_at) FROM stdin;
1	1	3dec0a4a-6b98-42d2-ad9b-2dd16ee539d3	2026-06-17 18:59:10.009+05:30	2026-06-17 20:59:10.009+05:30
\.


--
-- Name: inquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inquiries_id_seq', 4, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.media_id_seq', 279, true);


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pages_id_seq', 1, true);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_kv_id_seq', 1, false);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_locked_documents_id_seq', 56, true);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_locked_documents_rels_id_seq', 112, true);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_migrations_id_seq', 1, true);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_preferences_id_seq', 9, true);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_preferences_rels_id_seq', 16, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 29, true);


--
-- Name: projects_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_rels_id_seq', 393, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 12, true);


--
-- Name: stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stats_id_seq', 1, false);


--
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_members_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: inquiries inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT inquiries_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: payload_kv payload_kv_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects_rels projects_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects_rels
    ADD CONSTRAINT projects_rels_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: stats stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stats
    ADD CONSTRAINT stats_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: inquiries_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inquiries_created_at_idx ON public.inquiries USING btree (created_at);


--
-- Name: inquiries_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inquiries_updated_at_idx ON public.inquiries USING btree (updated_at);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: pages_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pages_created_at_idx ON public.pages USING btree (created_at);


--
-- Name: pages_hero_image_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pages_hero_image_idx ON public.pages USING btree (hero_image_id);


--
-- Name: pages_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pages_updated_at_idx ON public.pages USING btree (updated_at);


--
-- Name: payload_kv_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_inquiries_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_inquiries_id_idx ON public.payload_locked_documents_rels USING btree (inquiries_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_pages_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_pages_id_idx ON public.payload_locked_documents_rels USING btree (pages_id);


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_projects_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_projects_id_idx ON public.payload_locked_documents_rels USING btree (projects_id);


--
-- Name: payload_locked_documents_rels_services_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_services_id_idx ON public.payload_locked_documents_rels USING btree (services_id);


--
-- Name: payload_locked_documents_rels_stats_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_stats_id_idx ON public.payload_locked_documents_rels USING btree (stats_id);


--
-- Name: payload_locked_documents_rels_team_members_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_team_members_id_idx ON public.payload_locked_documents_rels USING btree (team_members_id);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: projects_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_created_at_idx ON public.projects USING btree (created_at);


--
-- Name: projects_hero_image_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_hero_image_idx ON public.projects USING btree (hero_image_id);


--
-- Name: projects_rels_media_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_rels_media_id_idx ON public.projects_rels USING btree (media_id);


--
-- Name: projects_rels_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_rels_order_idx ON public.projects_rels USING btree ("order");


--
-- Name: projects_rels_parent_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_rels_parent_idx ON public.projects_rels USING btree (parent_id);


--
-- Name: projects_rels_path_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_rels_path_idx ON public.projects_rels USING btree (path);


--
-- Name: projects_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX projects_updated_at_idx ON public.projects USING btree (updated_at);


--
-- Name: services_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX services_created_at_idx ON public.services USING btree (created_at);


--
-- Name: services_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX services_updated_at_idx ON public.services USING btree (updated_at);


--
-- Name: stats_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stats_created_at_idx ON public.stats USING btree (created_at);


--
-- Name: stats_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stats_updated_at_idx ON public.stats USING btree (updated_at);


--
-- Name: team_members_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX team_members_created_at_idx ON public.team_members USING btree (created_at);


--
-- Name: team_members_photo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX team_members_photo_idx ON public.team_members USING btree (photo_id);


--
-- Name: team_members_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX team_members_updated_at_idx ON public.team_members USING btree (updated_at);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: pages pages_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_inquiries_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_inquiries_fk FOREIGN KEY (inquiries_id) REFERENCES public.inquiries(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pages_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pages_fk FOREIGN KEY (pages_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_projects_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_projects_fk FOREIGN KEY (projects_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_services_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_services_fk FOREIGN KEY (services_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_stats_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_stats_fk FOREIGN KEY (stats_id) REFERENCES public.stats(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_team_members_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_team_members_fk FOREIGN KEY (team_members_id) REFERENCES public.team_members(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: projects projects_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: projects_rels projects_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects_rels
    ADD CONSTRAINT projects_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: projects_rels projects_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects_rels
    ADD CONSTRAINT projects_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_photo_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_photo_id_media_id_fk FOREIGN KEY (photo_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict MquiJxhULRpzbptCCrZ35uWQTVnl7tdhIvtB8hmnTAXHGWOL8Wl8baiisONoCwm

