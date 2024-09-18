--
-- PostgreSQL database dump
--


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Seed Data for Name: space_resources; Type: TABLE DATA;  Owner: postgres
--

INSERT INTO space_resources (name, resources, cluster_id)
VALUES
    ('CPU basic · 0.5 vCPU · 1 GB', '{ "cpu": { "type": "Intel", "num": "0.5" }, "memory": "1Gi" }' ,(SELECT cluster_id FROM cluster_infos LIMIT 1))
ON CONFLICT (name)
    DO UPDATE SET
                  resources = EXCLUDED.resources,
                  cluster_id = EXCLUDED.cluster_id;


INSERT INTO space_resources (name, resources, cluster_id)
VALUES
    ('CPU basic · 2 vCPU · 4 GB', '{ "cpu": { "type": "Intel", "num": "2" }, "memory": "4Gi" }', (SELECT cluster_id FROM cluster_infos LIMIT 1))
ON CONFLICT (name)
    DO UPDATE SET
                  resources = EXCLUDED.resources,
                  cluster_id = EXCLUDED.cluster_id;

INSERT INTO space_resources (name, resources,  cluster_id)
VALUES
    ('NVIDIA A10G · 4 vCPU · 16 GB', '{"gpu": { "type": "A10", "num": "1", "resource_name": "nvidia.com/gpu", "labels": { "aliyun.accelerator/nvidia_name": "NVIDIA-A10" } }, "cpu": { "type": "Intel", "num": "4" },  "memory": "16Gi" }', (SELECT cluster_id FROM cluster_infos LIMIT 1))
ON CONFLICT (name)
    DO UPDATE SET
                  resources = EXCLUDED.resources,
                  cluster_id = EXCLUDED.cluster_id;

INSERT INTO space_resources (name, resources,  cluster_id)
VALUES
    ('NVIDIA A10G · 2 · 4 vCPU · 16 GB', '{"gpu": { "type": "A10", "num": "2", "resource_name": "nvidia.com/gpu", "labels": { "aliyun.accelerator/nvidia_name": "NVIDIA-A10" } }, "cpu": { "type": "Intel", "num": "4" },  "memory": "16Gi" }', (SELECT cluster_id FROM cluster_infos LIMIT 1))
ON CONFLICT (name)
    DO UPDATE SET
                  resources = EXCLUDED.resources,
                  cluster_id = EXCLUDED.cluster_id;

--
-- Seed Data for Name: runtime_frameworks; Type: TABLE DATA;  Owner: postgres
--

INSERT INTO runtime_frameworks (id, frame_name, frame_version, frame_image, frame_cpu_image, enabled, container_port, type) VALUES ('1', 'VLLM', '2.7', 'vllm-local:2.7', 'vllm-cpu:2.3', 1, 8000, 1);
INSERT INTO runtime_frameworks (id, frame_name, frame_version, frame_image, frame_cpu_image, enabled, container_port, type) VALUES ('3', 'TGI', '2.1', 'tgi:2.1', '', 1, 8000, 1);
INSERT INTO runtime_frameworks (id, frame_name, frame_version, frame_image, frame_cpu_image, enabled, container_port, type) VALUES ('4', 'FastChat', '1.2', ' ', '', 1, 8000, 1);
INSERT INTO runtime_frameworks (id, frame_name, frame_version, frame_image, frame_cpu_image, enabled, container_port, type) VALUES ('6', 'MindIE', '1.0', ' ', '', 1, 8000, 1);
INSERT INTO runtime_frameworks (id, frame_name, frame_version, frame_image, frame_cpu_image, enabled, container_port, type) VALUES ('2', 'LLaMA-Factory', '1.11', 'llama-factory:1.18-cuda12.1-devel-ubuntu22.04-py310-torch2.1.2', '', 1, 8000, 2);

--
-- Name: runtime_frameworks_id_seq; Type: SEQUENCE SET;  Owner: postgres
--

SELECT pg_catalog.setval('runtime_frameworks_id_seq', 4, true);


