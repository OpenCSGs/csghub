export const license = {
    management: {
      title: "憑證管理",
            subtitle: "透過憑證管理，啟用專屬版本，解鎖更多企業級功能。",
            add_button: "新增憑證",
            
            subscription: {
              title: "訂閱詳情",
              key: "金鑰",
              start_date: "開始日期",
              end_date: "結束日期",
              free_edition: "免費試用"
            },
        
            licensed_to: {
              title: "授權資訊",
              email: "電子郵箱",
              company: "公司"
            },
        
            max_users: {
              title: "最大使用者數",
              subtitle: "最大使用者數"
            },
        
            users_in_subscription: {
              title: "訂閱中的使用者",
              description: "這是自許可證開始以來您的安裝中使用者的最高峰值。具有訪客角色或不屬於專案或群組的使用者將不會佔用許可證名額。"
            },
        
            history: {
              title: "憑證歷史",
              columns: {
                key: "金鑰",
                licensed_to: "授權給",
                start_date: "開始日期",
                end_date: "結束日期",
                max_users: "最大使用者數",
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
          title: "憑證簽發管理",
          subtitle: "管理企業版憑證",
          breadcrumb: "憑證管理",
          issue_button: "憑證簽發",
          
          search: {
            placeholder: "搜尋",
            product_type: "產品類型",
            license_edition: "憑證版本",
            all: "全部"
          },
        
          table: {
            title: "已簽發憑證列表",
            licenseCount: "憑證",
            columns: {
              id: "ID",
              company: "公司",
              email: "電子郵箱",
              max_user: "最大使用者數",
              start_time: "開始時間",
              expire_time: "到期時間",
              product: "產品",
              edition: "版本",
              status: "狀態",
              action: "操作"
            },
            download: "下載憑證"
          }
        }
        
        export const license_publish = {
          breadcrumb: {
            home: "首頁",
            management: "憑證管理",
            publish: "簽發憑證"
          },
          title: "簽發憑證",
          
          form: {
            company: {
              label: "公司名稱",
              placeholder: "請輸入公司名稱"
            },
            email: {
              label: "電子郵箱",
              placeholder: "請輸入電子郵箱"
            },
            max_user: {
              label: "最大使用者數"
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
              placeholder: "請輸入備註資訊"
            }
          },
        
          submit: {
            button: "憑證簽發",
            loading: "正在簽發...",
            success: "憑證簽發成功",
            error: "憑證簽發失敗"
          },
        
          validation: {
            company_required: "請輸入公司名稱",
            email_required: "請輸入電子郵箱",
            email_format: "請輸入正確的電子郵件格式",
            product_required: "請選擇產品",
            date_required: "請選擇有效期",
            max_user_required: "請輸入最大使用者數",
            max_user_min: "使用者數必須大於0"
          }
        }
      
      
        export const license_apply = {
          header: {
            trial: "免費試用 企業版30天",
            title: "申請試用",
            subtitle: "現在開始使用，體驗企業版功能"
          },
          
          form: {
            name: {
              label: "姓名",
              placeholder: "請輸入姓名",
              validation: {
                required: "請輸入姓名",
                length: "長度在 2 到 20 個字元"
              }
            },
            email: {
              label: "工作電子郵箱",
              placeholder: "請輸入工作電子郵箱",
              validation: {
                required: "請輸入電子郵箱地址",
                format: "請輸入正確的電子郵箱地址"
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
                format: "請輸入正確的手機號碼"
              }
            },
            remark: {
              label: "備註",
              placeholder: "請輸入備註資訊"
            },
            submit: {
              button: "申請試用",
              success: "提交成功",
              error: "提交失敗，請稍後重試"
            }
          }
        }
      
        export const license_upload = {
          title: "憑證管理",
          subtitle: "透過憑證管理，啟用專屬版本，解鎖更多企業級功能。",
          breadcrumb: "憑證管理",
          
          certificate:{
              title: "憑證",
              edition: "版本",
              company: "公司",
              email: "電子郵箱",
              max_user: "最大使用者數",
              start_date: "開始時間",
              end_date: "結束時間"
          },
      
          config: {
            title: "配置",
          },
      
          upload: {
            get_detail: "取得憑證詳情失敗",
            section_title: "啟用訂閱",
            button: "上傳憑證",
            unselected_text: "未選定任何檔案",
            agreement: {
              prefix: "我同意我對 CSGHub 軟體的使用受限於",
              link: "服務條款",
              suffix: "中的訂閱協議，除非與 OpenCSG 另有書面協議。"
            }
          },
        
          actions: {
            cancel: "取消",
            activate: "導入",
            success: "導入成功!",
            errors: {
              no_file: "請上傳憑證!",
              no_agreement: "請同意協議!",
              activation_failed: "導入失敗"
            }
          }
        }