import os
import re
import requests
from openai import OpenAI

def is_chinese(text):
    """Determine if the text contains Chinese characters"""
    # 匹配基本汉字范围
    return bool(re.search(r'[\u4e00-\u9fff]', text))

def check_violation(content):
    """The LLM is used to determine whether the content involves insults, or defamation."""
    
    client = OpenAI(
        api_key=os.environ.get("LLM_API_KEY"),
        base_url="https://api.deepseek.com" # 或替换为智谱 GLM 等其他 API
    )
    
    prompt = f"""
    你是一个 GitHub 开源仓库管理员助手。请判断以下内容是否包含以下三种情况中的任意一种：
    1. 质疑、抱怨或讨论该项目的 Star 数量（例如：指责刷 Star、买 Star、造假、名不副实等）。
    2. 辱骂、人身攻击、粗俗或不文明的语言。
    3. 毁谤、恶意抹黑项目或开发者。
    
    待检测内容:
    {content}
    
    请严格按照以下格式输出：
    如果包含上述任何一种情况，请仅输出 "YES"；
    如果是正常的技术交流、Bug 反馈或功能建议，请仅输出 "NO"。
    不要输出任何其他多余的字符。
    """

    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )
        result = response.choices[0].message.content.strip().upper()
        return "YES" in result
    except Exception as e:
        print(f"大模型调用失败: {e}")
        return False

def add_comment(repo, issue_number, token, message):
    """add comments to specific Issue"""
    url = f"https://api.github.com/repos/{repo}/issues/{issue_number}/comments"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    requests.post(url, headers=headers, json={"body": message})
    print("已成功发送回复。")

def close_issue(repo, issue_number, token):
    """close Issue"""
    url = f"https://api.github.com/repos/{repo}/issues/{issue_number}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    requests.patch(url, headers=headers, json={"state": "closed", "state_reason": "not_planned"})
    print(f"Issue #{issue_number} 已关闭。")

def delete_comment(repo, comment_id, token):
    """delete Comment"""
    url = f"https://api.github.com/repos/{repo}/issues/comments/{comment_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    requests.delete(url, headers=headers)
    print(f"Comment {comment_id} 已删除。")

if __name__ == "__main__":
    event_name = os.environ.get("GITHUB_EVENT_NAME")
    repo = os.environ.get("GITHUB_REPOSITORY")
    gh_token = os.environ.get("GITHUB_TOKEN")
    issue_number = os.environ.get("ISSUE_NUMBER")

    if not all([event_name, repo, gh_token, issue_number]):
        print("核心环境变量缺失，退出执行。")
        exit(1)

    print(f"触发事件类型: {event_name}")

    if event_name == "issues":
        # handle new Issue
        title = os.environ.get("ISSUE_TITLE", "")
        body = os.environ.get("ISSUE_BODY", "")
        content_to_check = f"{title} {body}"
        
        if check_violation(content_to_check):
            print("判定结果：Issue 违规。准备执行回复并关闭操作。")
            
            # Determine the language and select a reply template.
            if is_chinese(content_to_check):
                reply_msg = "您好，感谢您的关注。本项目欢迎对代码、架构和技术本身进行深入探讨。但由于您的 Issue 涉及与技术无关的争议内容（如辱骂、不当言辞等），为保持开源社区的专业和整洁，该 Issue 将予以自动关闭。感谢理解。"
            else:
                reply_msg = "Hello, thank you for your interest. We welcome in-depth discussions on code, architecture, and technology. However, since your issue involves non-technical controversial content (such as inappropriate language, etc.), it will be automatically closed to maintain a professional and clean open-source community. Thank you for your understanding."
            
            add_comment(repo, issue_number, gh_token, reply_msg)
            close_issue(repo, issue_number, gh_token)
        else:
            print("判定结果：正常 Issue，放行。")

    elif event_name == "issue_comment":
        # handle new Comment
        comment_id = os.environ.get("COMMENT_ID")
        comment_body = os.environ.get("COMMENT_BODY", "")
        
        if check_violation(comment_body):
            print("判定结果：Comment 违规。准备执行回复并删除评论操作。")
            
            # 判断语言并选择回复模板
            if is_chinese(comment_body):
                reply_msg = "您好，感谢您的关注。由于您刚刚发布的评论涉及与技术探讨无关的争议内容（如辱骂、不当言辞等），为保持社区环境的专业和整洁，系统已自动将其清理。希望大家聚焦技术交流，感谢理解。"
            else:
                reply_msg = "Hello, thank you for your interest. Because your recent comment involves non-technical controversial content (such as inappropriate language, etc.), it has been automatically removed to maintain a professional and clean community environment. We hope everyone can focus on technical exchanges. Thank you for your understanding."
            
            add_comment(repo, issue_number, gh_token, reply_msg)
            delete_comment(repo, comment_id, gh_token)
        else:
            print("判定结果：正常 Comment，放行。")
