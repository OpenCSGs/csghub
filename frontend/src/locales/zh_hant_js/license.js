export const license = {
    management: {
      title: "證書管理",
      subtitle: "通過證書管理，激活專屬版本，解鎖更多企業級功能。",
      add_button: "添加證書",
      
      subscription: {
        title: "訂閱詳情",
        key: "密鑰",
        start_date: "開始日期",
        end_date: "結束日期",
        free_edition: "免費試用"
      },
  
      licensed_to: {
        title: "授權信息",
        email: "郵箱",
        company: "公司"
      },
  
      max_users: {
        title: "最大用戶數",
        subtitle: "最大用戶數"
      },
  
      users_in_subscription: {
        title: "訂閱中的用戶",
        description: "這是自許可證開始以來您的安裝中用戶嘅最高峰值。具有訪客角色或唔屬於項目或組嘅用戶將唔會佔用許可證名額。"
      },
  
      history: {
        title: "許可證歷史",
        columns: {
          key: "密鑰",
          licensed_to: "授權畀",
          start_date: "開始日期",
          end_date: "結束日期",
          max_users: "最大用戶數",
          status: "狀態"
        },
        status: {
          active: "生效中",
          expired: "已過期",
          pending: "待生效"
        }
      }
    }
  }
  
  export const license_publish_list = {
    title: "證書簽發管理",
    subtitle: "管理企業版證書",
    breadcrumb: "證書管理",
    issue_button: "證書簽發",
    
    search: {
      placeholder: "搜索",
      product_type: "產品類型",
      license_edition: "證書版本",
      all: "全部"
    },
  
    table: {
      title: "已簽發證書列表",
      licenseCount: "證書",
      columns: {
        id: "ID",
        company: "公司",
        email: "郵箱",
        max_user: "最大用戶數",
        start_time: "開始時間",
        expire_time: "到期時間",
        product: "產品",
        edition: "版本",
        status: "狀態",
        action: "操作"
      },
      download: "下載證書"
    }
  }
  
  export const license_publish = {
    breadcrumb: {
      home: "首頁",
      management: "證書管理",
      publish: "簽發證書"
    },
    title: "簽發證書",
    
    form: {
      company: {
        label: "公司名稱",
        placeholder: "請輸入公司名稱"
      },
      email: {
        label: "郵箱",
        placeholder: "請輸入郵箱"
      },
      max_user: {
        label: "最大用戶數"
      },
      product: {
        label: "產品",
        placeholder: "請選擇產品"
      },
      edition: {
        label: "版本",
        placeholder: "請選擇版本"
      },
      date_range: {
        label: "有效期",
        start_placeholder: "開始日期",
        end_placeholder: "結束日期"
      },
      remark: {
        label: "備註",
        placeholder: "請輸入備註信息"
      }
    },
  
    submit: {
      button: "證書簽發",
      loading: "正在簽發...",
      success: "證書簽發成功",
      error: "證書簽發失敗"
    },
  
    validation: {
      company_required: "請輸入公司名稱",
      email_required: "請輸入郵箱",
      email_format: "請輸入正確嘅郵箱格式",
      product_required: "請選擇產品",
      date_required: "請選擇有效期",
      max_user_required: "請輸入最大用戶數",
      max_user_min: "用戶數必須大於 0"
    }
  } 


  export const license_apply = {
    header: {
      trial: "免費試用 企業版 30 天",
      title: "申請試用",
      subtitle: "現在開始使用，體驗企業版功能"
    },
    
    form: {
      name: {
        label: "姓名",
        placeholder: "請輸入姓名",
        validation: {
          required: "請輸入姓名",
          length: "長度在 2 到 20 個字符"
        }
      },
      email: {
        label: "工作郵箱",
        placeholder: "請輸入工作郵箱",
        validation: {
          required: "請輸入郵箱地址",
          format: "請輸入正確嘅郵箱地址"
        }
      },
      company: {
        label: "公司名稱",
        placeholder: "請輸入公司名稱",
        validation: {
          required: "請輸入公司名稱"
        }
      },
      phone: {
        label: "聯絡方式",
        placeholder: "請輸入聯絡方式",
        validation: {
          required: "請輸入聯絡方式",
          format: "請輸入正確嘅手機號碼"
        }
      },
      remark: {
        label: "備註",
        placeholder: "請輸入備註信息"
      },
      submit: {
        button: "申請試用",
        success: "提交成功",
        error: "提交失敗，請稍後重試"
      }
    }
  } 

  export const license_upload = {
    title: "證書管理",
    subtitle: "通過證書管理，激活專屬版本，解鎖更多企業級功能。",
    breadcrumb: "證書管理",
    
    certificate:{
        title: "證書",
        edition: "版本",
        company: "公司",
        email: "郵箱",
        max_user: "最大用戶數",
        start_date: "開始時間",
        end_date: "結束時間"
    },

    config: {
      title: "配置",
    },

    upload: {
      get_detail: "獲取證書詳情失敗",
      section_title: "激活訂閱",
      button: "上傳證書",
      unselected_text: "未選定任何文件",
      agreement: {
        prefix: "我同意我對 CSGHub 軟件嘅使用受限於",
        link: "服務條款",
        suffix: "中嘅訂閱協議，除非與 OpenCSG 另有書面協議。"
      }
    },
  
    actions: {
      cancel: "取消",
      activate: "導入",
      success: "導入成功!",
      errors: {
        no_file: "請上傳證書!",
        no_agreement: "請同意協議!",
        activation_failed: "導入失敗"
      }
    }
  }