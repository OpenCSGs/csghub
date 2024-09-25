## Release Notes

- [2024.09.15] v0.9.0 `CSGHub` portal been migrated to the Go version, git server support Gitaly and use it as default, collections function been added, new resource console page, running space endpoint finetune do not need domain anymore other UX optimization and bug fix.
- [2024.08.15] v0.8.0 Big release to introduce a standalone `user_server` service and move user, org, token management from ``CSGHub`` to backend server ``CSGHub`-server`, introduce a standalone `starhub_server_runner service` for uniformed deployment of Application Space, Mode Inference and Finetune. Resource management enchanced, multiple k8s clusters in different regions are not supported.
- [2024.07.15] v0.7.0 Big release to support `Multiple Resource Sync` for models and datasets, One-Click Fintune, Resource Usage Metering.
- [2024.06.21] v0.6.1 bug fix and user experience enhancement.
- [2024.06.18] v0.6.0 Big release to support `dedicated` model inference endpoint, support `streamlit` Space, allow use to `like` repos allow to set repo's `industry tag`, enhance git history and commit diff details.
- [2024.05.14] v0.5.0 Enhance Space user experience, auto build `relations` between repos(model,dataset,code and spaces), support multiple files uploading.
- [2024.04.18] v0.4.0 Allow to run `Application Space` (gradio app), add a widget to try model inference, support new repo type `Code`, support organization members management, support wechat login.
- [2024.03.15] v0.3.0 Plan: Files online editing, organization edit, dataset preview.
- [2024.02.15] v0.2.0 Improve the function of model dataset hosting, and add the feature of inviting new organization members.
- [2024.01.15] v0.1.0 `CSGHub` Alpha version release, supports model and dataset management functions, detailed function is as below.