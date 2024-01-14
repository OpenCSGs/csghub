Contributing to CSGHub
=======================

[中文版本](/CONTRIBUTING.md)

Welcome to CSGHub and thank you for your interest in contributing to this project!

CSGHub is an open-source and trusted asset management platform for large models. It aims to assist users in governing assets, such as datasets, model files, and code, throughout the lifecycle of LLM (Large Language Models) and LLM applications. CSGHub provides functionality similar to a private version of Huggingface and manages LLM assets in a way that is similar to OpenStack Glance for managing virtual machine images, Harbor for managing container images, and Sonatype Nexus for managing artifacts.

Contribution Workflow
----------------------

To contribute to the project, please follow the "fork and pull request" workflow. Please refrain from pushing directly to the main repository unless you are a maintainer.

1. Fork the repository from GitHub (https://github.com/OpenCSGs/csghub) to your own GitHub account.
2. Make the desired changes and improvements in your forked repository.
3. Create a new branch in your forked repository to accommodate your modifications. It is recommended to base your branch on the `main` branch.
4. Make the necessary modifications and improvements in your new branch.
5. Once you have completed your changes, submit a Pull Request (PR) to the `main` branch of the original repository.
6. Maintainers will review your PR, provide feedback, and engage in discussions.
7. After necessary modifications and discussions, your PR will be merged into the `main` branch.

Make sure your contributions adhere to the following guidelines:

- Maintain consistent code style with the project.
- New features or improvements should have appropriate tests.
- Document additions or modifications should be clear and understandable to facilitate usage by other developers.

Reporting Issues and Making Suggestions
----------------------

If you encounter any issues, have suggestions for improvements, or want to request new features, please report them on our [Issues](https://github.com/OpenCSGs/csghub/issues) page. We regularly review and respond to your feedback.

When reporting issues or making suggestions, please follow these guidelines:

- Provide as much detail as possible. Clearly describe what is going wrong, how it is failing, and if there are any error messages. A description like "XY doesn't work" is not helpful for troubleshooting. Always include the code you ran and, if possible, extract the relevant parts instead of including the entire script. This helps us reproduce the error.
- If you need to include long code blocks, logs, or tracebacks, wrap them in `<details>` and `</details>` tags. This collapses the content, making the issue easier to read and follow. Refer to [this link](https://developer.mozilla.org/en/docs/Web/HTML/Element/details) for more information on collapsing content.

Issue Labels
----------------------

For an overview of the labeling system we use to tag issues and pull requests, please refer to [this page](https://github.com/OpenCSGs/csghub/labels).  


Local Development
----------------------

You can develop CSGHub using [Docker Compose](docs/all_in_one_readme_en.md) or your [local environment](docs/setup_en.md).

Thank you for contributing to the CSGHub project! We look forward to your involvement and suggestions.
