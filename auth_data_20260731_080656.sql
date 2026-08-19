--
-- PostgreSQL database dump
--

\restrict MaFJIX3YnrhTqgopma1HP0PIbW8fnE3oMdvkJSzexV1FTujCFYrEKG6loKUde6y

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
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") FROM stdin;
L0Eem4rhQ7XLGoYBj7lEpnSyI4eCwhgM	2026-08-03 19:18:55.567	iETqfCpdP2k3D0ut77zOcP0iHKfbj68Q	2026-07-27 19:18:55.567	2026-07-27 19:18:55.567			SIgEXSfPRaoug2S77YorCrLsgWiWizmd
KQQ7hyvHZ5ZykX2YrdLAxuGeyyodt1Lf	2026-08-03 19:25:27.756	W9UfzGSWDvbbYLop2ge51aP7Z9Yh7wJe	2026-07-27 19:25:27.756	2026-07-27 19:25:27.756		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0	W4JSqLp9WdqyASjepXwwDldzEO9xFjxC
4xVDSg9Hv3b7xq6Qa0fyGMFEttLf0xlB	2026-08-05 12:07:02.842	1VoESmwaVp45eK39zpCjT2XZvTjKrLtS	2026-07-27 19:21:02.371	2026-07-29 12:07:02.845		Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	SIgEXSfPRaoug2S77YorCrLsgWiWizmd
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: ramais_user
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- PostgreSQL database dump complete
--

\unrestrict MaFJIX3YnrhTqgopma1HP0PIbW8fnE3oMdvkJSzexV1FTujCFYrEKG6loKUde6y

