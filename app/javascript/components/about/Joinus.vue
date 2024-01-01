<template>
  <div class="mx-auto max-w-[1280px] pt-[127px] md:pt-[40px] mb-[70px] md:pb-[40px] md:px-[20px]">
    <div
        class="text-[#303133] text-[30px] leading-[38px] font-semibold mb-[24px] text-center md:text-[28px] md:text-center">
      加入我们
    </div>
    <div class="grid grid-cols-3 gap-[24px] xl:px-[20px] md:flex md:flex-col">
      <div
          class="hover:text-[#1A8B7B] leading-[28px] p-[20px] bg-white shadow-md text-[20px] font-medium text-[#41414B] cursor-pointer min-h-[120px] rounded-[8px] md:text-[18px] md:w-auto md:min-h-[90px] md:leading-[26px]"
          v-for="item in joinData" :key="item.desc"
          @click="jobDetails(item)">
        <div class="flex justify-between mb-[10px]">{{ item.title }}<span class="w-[20px] h-[20px]" v-if="item.isHot"><svg
            t="1693197896423" class="icon"
            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4038" width="25"
            height="25">
              <path
                  d="M423.033344 0c228.4032 108.4416 265.6256 357.3248 265.6256 357.3248 71.7312-90.112 8.9088-179.712 8.9088-179.712 181.76 179.712 232.6016 401.3056 183.8592 566.8352-36.1472 125.7472-257.7408 256.2048-382.464 256.2048-113.152 0-292.864-64.4096-361.984-198.0416C60.946944 654.8992 128.018944 495.616 169.439744 419.6352c41.3696-75.9296 41.3696-140.3904 41.3696-140.3904 48.7424 54.9888 39.3216 151.9104 39.3216 151.9104s74.3936-92.672 136.192-205.312C448.172544 113.152 423.033344 0 423.033344 0z m101.632 549.0688c-29.8496 0-53.4528 9.9328-71.7824 29.3376-18.3296 19.9168-27.2384 45.056-27.2384 75.9296 0 29.3888 8.9088 53.4528 26.7264 71.7824 17.8176 18.3296 40.8576 27.8016 69.12 27.8016 29.3376 0 52.9408-9.472 70.7584-28.8256 17.8176-19.4048 27.2384-44.544 26.1632-74.9056 0-29.9008-8.3456-53.9648-25.6512-72.8576-16.7424-18.8416-39.8336-28.2624-68.096-28.2624z m-259.328 3.1232h-42.496v198.0416h42.496v-81.7152h84.3264v81.7152h42.4448v-198.0416h-42.4448v80.1792H265.337344v-80.1792z m512.3584 0H622.610944v34.56h56.576v163.4816h42.496V586.752h56.0128v-34.56z m-255.6416 35.84c16.2816 0 28.8256 6.2464 37.7344 17.7664 8.9088 11.5712 13.6192 28.3136 13.6192 48.7424 0 19.9168-4.1984 35.6352-13.6192 47.1552-9.4208 12.032-22.016 17.8176-38.7584 17.8176a45.9776 45.9776 0 0 1-38.2464-18.3296c-9.4208-12.0832-14.1312-27.8016-14.1312-47.1552 0-19.4048 4.7104-35.6352 14.1312-47.6672a47.9744 47.9744 0 0 1 39.2704-18.3296z"
                  fill="#FF4C4C" p-id="4039"></path>
            </svg></span></div>
        <div class="text-[18px] text-[#ADADAD] leading-[26px] font-medium md:leading-[21px]">{{ item.desc }}</div>
      </div>
    </div>
    <el-dialog title="详情" v-model="jobVisible" width="80%" :show-close="true" center>
      <div class="center tracking-[2px] py-[16px]">
        <div class="text-[39px] leading-[47px] text-center mb-[25px]">{{ job.title }}</div>
        <div class="text-[20px] font-medium leading-[30px] text-[#41414B]">工作地点:{{ job.place }}</div>
        <div class="text-[20px] font-medium leading-[30px] text-[#41414B] mt-[10px]">岗位职责</div>
        <div class="lg:hidden" v-for="item in job.zhize" :key="item">{{ item }}</div>
        <div class="text-[20px] font-medium leading-[30px] text-[#41414B] mt-[10px]">岗位要求</div>
        <div class="lg:hidden" v-for="item in job.yaoqiu" :key="item">{{ item }}</div>
        <div class="text-[20px] font-medium leading-[30px] text-[#41414B] mt-[10px]">薪酬待遇</div>
        <div class="lg:hidden" v-for="item in job.xinzi" :key="item">{{ item }}</div>
        <div class="text-[20px] font-medium leading-[30px] text-[#41414B] mt-[10px]">投递方式</div>
        <div class="lg:hidden">投递地址 ： hr@opencsg.com</div>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'Joinus',
  data() {
    return {
      jobVisible: false,
      job: {title: '', desc: '', place: '', zhize: [], yaoqiu: [], xinzi: []},
      joinData: [{
        isHot: true,
        title: '商务经理',
        desc: '参与公司产品销售战略目标规划和制定，根据公司目标编制年度营销计划和方案',
        zhize: ['参与公司产品销售战略目标规划和制定，根据公司目标编制年度营销计划和方案', '根据营销计划和方案，制订详细的业务拓展和销售的执行方案并组织实施', '定期进行客户走访，组织搜集和汇报市场信息、新技术产品开发信息、用户的反馈信息、市场发展趋势信息等，为本人及相关部门的决策提供依据', '与研发、产品、市场等部门共同定义产品功能、价格，根据市场变化及时提出调整价格的建议及方案', '结合AIGC新动向，维护战略合作客户的关系，有效执行落地商务合作方案，打造标杆案例', '拓展新的战略合作伙伴，拓展及维护新老合作伙伴，与各合作伙伴建立长期稳定的合作关系，达成业绩目标'],
        yaoqiu: ['本科及以上学历，三年以上企业级软件服务，人工智能行业的商务拓展和产品销售经验', '协调内外部各方资源，有效执行落地商务合作方案，完成销售业绩目标', '对AIGC 类产品有一定深度的理解和经验，具备相关领域中英文论文阅读能力', '具有较强的市场敏锐度，能够迅速适应市场环境变化，能承受较强的工作压力', '深入挖掘合作伙伴需求和潜力，结合市场新玩法，制定个性化合作方案，打造标杆案例'],
        xinzi: ['面议', '弹性工作'],
        place: '上海'
      }, {
        isHot: true,
        title: "软件开发工程师-大模型平台开发",
        desc: "与团队合作，参与大模型生命周期的开发、部署和优化",
        zhize: ["与团队合作，参与大模型生命周期的开发、部署和优化", "使用Python和Node.js等编程语言进行开发，确保代码的质量和可扩展性", "  - 熟悉云原生技术，如Kubernetes和Docker，以支持模型的部署和管理", "能够进行大模型的微调训练，以提高模型的性能和准确性", "开发和维护大模型的应用程序，并确保其高效、可靠和易用", "解决开发过程中的难题和挑战，并与团队成员合作推动项目的进展"],
        yaoqiu: ["本科及以上学历，在计算机科学、软件工程或相关领域有相关专业知识", "至少三年以上的软件开发经验，熟悉常见的软件开发流程和方法", "熟练掌握Python和Node.js等编程语言，具备良好的编码习惯和技巧", "具备大模型开发经验，能够理解和应用相关的算法和技术", "熟悉云原生技术和工具，特别是Kubernetes和Docker", "优先考虑了解LangChain、Ray、Gradio和VectorDB等大模型开发相关工具的人员", "具备良好的沟通和团队合作能力，能够与不同背景的团队成员协作"],
        xinzi: ["面议", "弹性工作"],
        place: "西安"
      }, {
        isHot: true,
        title: "软件开发工程师-大模型应用开发",
        desc: "分析不同应用场景下的需求，设计大模型应用方案",
        zhize: ["分析不同应用场景下的需求，设计大模型应用方案", "负责大模型应用的开发、部署和优化", "进行大模型的微调训练，以提高模型的性能和准确性", "解决开发过程中的难题和挑战，并与团队成员合作推动项目的进展"],
        yaoqiu: ["本科及以上学历，计算机科学、软件工程、人工智能等相关专业", "至少三年以上的软件开发经验，熟悉Python语言，具备较强的编程能力和算法基础", "熟悉Kubernetes和Docker等云原生相关的技术和工具", "对大模型（如GPT、LLaMA）、向量数据库、提示工程及LangChain有一定了解，有应用开发和模型微调经验者优先", "有积极的学习意识、较强的动手能力和钻研精神，具备良好的沟通和团队协作能力", "加分项：有数据分析、机器学习等相关经验", "加分项：拥有相关领域的开源项目或技术博客"],
        xinzi: ["面议", "弹性工作"],
        place: "上海"
      }, {
        title: '法务',
        desc: '负责公司日常的法律事务工作，包括但不限于起草、审核和修订各类合同、协议等法律文件，提供法律咨询等服务',
        zhize: ['负责公司日常的法律事务工作，包括但不限于起草、审核和修订各类合同、协议等法律文件，提供法律咨询等服务；', '参与公司各项业务活动的谈判、沟通和协调工作，为公司提供法律风险分析和预警；', '参与公司法律框架的制定和优化，建立并完善公司内部法律规章制度及流程，为公司经营和发展提供支持；', '参与公司重大法律事件的处理工作，包括但不限于公司并购、诉讼、仲裁等事项，确保公司在法律方面的权益得到最大程度的维护。'],
        yaoqiu: ['具有法律专业本科及以上学历，具备执业律师资格证书为佳，3-5年相关工作经验；', '具有扎实的法律基础知识以及丰富的实践经验，对劳动法、合同法、公司法等法律领域有较深入的了解；', '具有良好的分析、判断、解决问题和处理复杂事务的能力，能够独立完成工作任务；', '有较强的学习能力和适应能力，能够快速适应公司内部的法律体系和工作环境；', '具有较强的团队合作精神，能够有效协调内部各方利益关系，积极推进工作进程。', '爱好科技行业，尤其AI人工智能相关'],
        xinzi: ['面议', '弹性工作'],
        place: '北京'
      }, {
        title: '算法工程师',
        desc: '参与大语言模型的研发、部署、微调, 究和开发NLP领域算法，并将算法应用到实际业务场景',
        zhize: ['- 参与大语言模型的研发、部署、微调, 究和开发NLP领域算法，并将算法应用到实际业务场景；', '- 参与实际业务数据的处理，能将业务数据处理成NLP算法需要的数据格式；', '- 承担大语言模型的功能实现、性能优化、系统调优、硬件适配等工作；'],
        yaoqiu: ['- 硕士及以上学历，计算机、自然语言处理、机器学习等相关专业背景；3年以上相关工作经验；', '- 熟悉文本分类、预训练语言模型、命名实体识别、语义分析、摘要生成、事件抽取等自然语言处理任务；', '- 对深度学习、Transformer、预训练有一定深度的理解和经验,能根据论文复现相关算法；', '- 有大规模预训练模型研发和训练经验者优先；具备独立算法编写、优化、调试、运行和部署模型代码的能力；', '- 熟悉PyTorch、TensorFlow等至少一种深度学习框架；', '- 具备NLP方向中英文论文熟练阅读的能力；', '- 责任心强，积极主动，有良好的沟通能力和团队合作能力；'],
        xinzi: ['面议', '弹性工作'],
        place: '成都、西安、北京、上海'
      }, {
        title: '产品经理',
        desc: '- 负责 NLP 相关产品的规划，设计和落地，协调算法，研发工程团队资源，对产品竞争力负责',
        zhize: ['- 负责 NLP 相关产品的规划，设计和落地，协调算法，研发工程团队资源，对产品竞争力负责；', '- 基于企业级技术与产品开发经验，参加调研客户需求，提炼产品设计，提出解决方案，对产品商业化负责；', '- 参与大语言模型的研发、部署、微调, 究和开发NLP领域算法，并将算法应用到实际业务场景；参与规划和执行产品相关运营工作。'],
        yaoqiu: ['- 硕士及以上学历，计算机、自然语言处理、机器学习等相关专业背景；五年以上技术研发或企业级产品设计经验；三年以上产品研发团队的项目管理经验；', '- 具备产品规划、产品定义、产品生命周期管理和工程研发管理的能力；有市场和商业敏锐洞察，产品商业化经验；', '- 对深度学习、Transformer、预训练有一定深度的理解和经验,具备NLP方向中英文论文熟练阅读的能力；', '- 责任心强，积极主动，有良好的沟通能力和团队合作能力；'],
        xinzi: ['面议', '弹性工作'],
        place: '成都、西安、北京、上海'
      }, {
        title: '数据工程师',
        desc: '负责数据抓取、清洗、融合等工作',
        zhize: ['- 负责数据抓取、清洗、融合等工作；', '- 提升数据抓取的及时性和覆盖率，有优秀抓取策略者优先；', '- 根据业务需求，高标准对数据进行加工处理。', '- 对接数据标注人员，负责标注数据审核；'],
        yaoqiu: ['- 本科及以上学历；', '- 熟练使用Python，nodejs语言，有扎实的计算机网络基础；', '- 熟悉常用Linux命令，能够在Linux环境下开发部署测试；', '- 熟练使用MySQL，Redis，Mongo等数据库工具；', '- 熟练使用正则表达式，从结构化的和非结构化的数据中获取信息；', '- 具有数据挖掘、自然语言处理、信息检索、机器学习背景者优先。', '- 责任心强，积极主动，有良好的沟通能力和团队合作能力；'],
        xinzi: ['面议', '弹性工作'],
        place: '成都、西安、北京、上海'
      }],
      joinData_en: [{
        isHot: true,
        title: "Business Manager",
        desc: "Participate in the planning and formulation of the company's product sales strategy goals, prepare annual marketing plans and programs according to the company's goals",
        zhize: ["Participate in the company's product sales strategy goal planning and formulation, prepare according to the company goals Annual marketing plan and plan", "According to the marketing plan and plan, formulate detailed business development and sales implementation plans and organize the implementation", "Regularly conduct customer visits, organize the collection and reporting of market information, new technology product development information, user feedback Feedback information, market development trend information, etc., provide the basis for the decision-making of the person and relevant departments", "co-define product functions and prices with R&D, product, market and other departments, and propose timely suggestions and plans to adjust prices according to market changes", " In combination with AIGC's new trends, maintain the relationship with strategic cooperative customers, effectively implement the commercial cooperation plan, and create benchmark cases", "expand new strategic partners, expand and maintain new and old partners, and establish long-term and stable cooperative relationships with partners , to achieve performance goals"],
        yaoqiu: ["Bachelor degree or above, more than three years of enterprise-level software services, business development and product sales experience in the artificial intelligence industry", "coordinate internal and external resources, and effectively implement the landing business cooperation plan , to complete the sales performance target", "has a certain depth of understanding and experience in AIGC products, and has the ability to read Chinese and English papers in related fields", "has strong market acumen, can quickly adapt to changes in the market environment, and can withstand strong work pressure", "deeply tap the needs and potential of partners, combine new market methods, formulate personalized cooperation plans, and create benchmark cases"],
        xinzi: ["negotiable", "flexible work"],
        place: "Shanghai"
      }, {
        isHot: true,
        title: "Software Development Engineer-Large Model Platform Development",
        desc: "Work with the team to participate in the development, deployment and optimization of the large model life cycle",
        zhize: ["Work with the team to participate in the development, deployment and optimization of the large model life cycle", "Use programming languages such as Python and Node.js Conduct development to ensure code quality and scalability", " - Familiar with cloud native technologies such as Kubernetes and Docker to support model deployment and management", "Ability to fine-tune training of large models to improve model performance and accuracy ", "Develop and maintain large-model applications and ensure they are efficient, reliable, and easy to use", "Resolve problems and challenges during the development process, and work with team members to promote the progress of the project"],
        yaoqiu: [" Bachelor degree or above, relevant professional knowledge in computer science, software engineering or related fields", "At least three years of software development experience, familiar with common software development processes and methods", "Proficient in programming such as Python and Node.js language, and have good coding habits and skills", "Have experience in large model development and be able to understand and apply related algorithms and technologies", "Familiar with cloud native technologies and tools, especially Kubernetes and Docker", "Priority is given to understanding LangChain, Personnel who develop related tools for large models such as Ray, Gradio and VectorDB", "Have good communication and teamwork skills, and can collaborate with team members from different backgrounds"],
        xinzi: ["Negotiable", "Flexible work"],
        place: "Xi'an"
      }, {
        isHot: true,
        title: "Software Development Engineer-Large Model Application Development",
        desc: "Analyze the needs in different application scenarios and design large model application solutions",
        zhize: ["Analyze the needs in different application scenarios and design large model application solutions", "Responsible for the development, deployment and optimization of large model applications", "Perform fine-tuning training of large models to improve the performance and accuracy of the model", "Resolve problems and challenges during the development process, and work with team members to promote the progress of the project"],
        yaoqiu: ["Bachelor degree or above, computer science Science, software engineering, artificial intelligence and other related majors", "At least three years of software development experience, familiar with Python language, strong programming skills and algorithm foundation", "Familiar with cloud-native related technologies and tools such as Kubernetes and Docker ", "Have a certain understanding of large models (such as GPT, LLaMA), vector databases, prompt projects and LangChain. Applicants with experience in application development and model fine-tuning are preferred", "Have a positive sense of learning, strong hands-on ability and research spirit , have good communication and teamwork skills", "Extra points: have relevant experience in data analysis, machine learning, etc.", "Extra points: have open source projects or technology blogs in related fields"],
        xinzi: ["Negotiable", "Flexible work"],
        place: "Shanghai"
      }, {
        title: "Legal Affairs",
        desc: "Responsible for the company's daily legal affairs, including but not limited to drafting, reviewing and revising various contracts, agreements and other legal documents, providing legal consultation and other services",
        zhize: [" Responsible for the company's daily legal affairs, including but not limited to drafting, reviewing and revising various contracts, agreements and other legal documents, providing legal consulting and other services; ", "Participate in the negotiation, communication and coordination of various business activities of the company, for The company provides legal risk analysis and early warning;", "Participate in the formulation and optimization of the company's legal framework, establish and improve the company's internal legal rules and procedures, and provide support for the company's operation and development;", "Participate in the handling of major legal events of the company , including but not limited to company mergers and acquisitions, litigation, arbitration and other matters, to ensure that the company's legal rights and interests are protected to the greatest extent."],
        yaoqiu: ["Having a bachelor's degree in law or above, and a practicing lawyer qualification certificate is preferred. 3-5 years of relevant work experience; ", "Have solid legal basic knowledge and rich practical experience, and have a deeper understanding of labor law, contract law, company law and other legal fields;", "Have good analysis and judgment , the ability to solve problems and handle complex affairs, and be able to complete work tasks independently;", "Have strong learning ability and adaptability, and can quickly adapt to the company's internal legal system and working environment;", "Have strong teamwork spirit, can effectively coordinate the internal interests of all parties, and actively promote the work process.", "I like the technology industry, especially related to AI artificial intelligence"],
        xinzi: ["Negotiable", "Flexible work"],
        place: "Beijing"
      }, {
        title: "Algorithm Engineer",
        desc: "Participate in the development, deployment, and fine-tuning of large language models , Research and develop algorithms in the NLP field, and apply the algorithms to actual business scenarios",
        zhize: ["- Participate in the research and development, deployment, and fine-tuning of large language models, Research and develop algorithms in the NLP field, and apply algorithms to actual business scenarios; ", "- Participate in the processing of actual business data, and can process business data into the data format required by the NLP algorithm;", "- Undertake the function implementation, performance optimization, system tuning, hardware adaptation, etc. of the large language model;"],
        yaoqiu: ["- Master degree or above, computer, natural language processing, machine learning and other related professional background; more than 3 years of relevant work experience;", "- Familiar with text classification, pre-trained language model, named entity recognition, semantics Natural language processing tasks such as analysis, summary generation, and event extraction; ", "- have a certain depth of understanding and experience in deep learning, Transformer, and pre-training, and can reproduce related algorithms based on papers; ", "- have large-scale pre-training Experience in model development and training is preferred; ability to write, optimize, debug, run and deploy model codes for independent algorithms; ", "- Familiar with at least one deep learning framework such as PyTorch, TensorFlow, etc.; ", "- Possess the direction of NLP in Chinese and English The ability to read papers proficiently;", "- Strong sense of responsibility, proactive, good communication skills and teamwork skills;"],
        xinzi: ["Negotiable", "Flexible work"],
        place: "Chengdu, Xi'an, Beijing, Shanghai"
      }, {
        title: "Product Manager",
        desc: "- Responsible for the planning, design and implementation of NLP-related products, coordination algorithms, R&D engineering team resources, responsible for product competitiveness",
        zhize: ["- Responsible Planning, design and implementation of NLP-related products, coordination algorithms, R&D engineering team resources, and being responsible for product competitiveness; ", "- Based on enterprise-level technology and product development experience, participate in research on customer needs, refine product design, and propose solutions, Responsible for product commercialization; ", "- Participate in the research and development, deployment, and fine-tuning of large language models, research and develop algorithms in the NLP field, and apply algorithms to actual business scenarios; participate in the planning and execution of product-related operations. "],
        yaoqiu: ["-Master's degree or above, computer, natural language processing, machine learning and other related professional background; more than five years of experience in technology research and development or enterprise-level product design; more than three years of project management experience in product development teams;", "- Possess the ability of product planning, product definition, product life cycle management and engineering R&D management; have market and business insights, and experience in product commercialization;", "- Have a certain in-depth understanding of deep learning, Transformer, and pre-training and experience, with the ability to read Chinese and English papers proficiently in the direction of NLP;", "- Strong sense of responsibility, proactive, good communication skills and teamwork skills;"],
        xinzi: ["Negotiable", "Flexible work"],
        place: "Chengdu, Xi'an, Beijing, Shanghai"
      }, {
        title: "Data Engineer",
        desc: "Responsible for data capture, cleaning, fusion, etc.",
        zhize: ["- Responsible for data capture, cleaning, fusion, etc.;", "- Improve data capture For timeliness and coverage, those with excellent capture strategies are preferred; ", "- According to business needs, process data with high standards. ", "- Connect with data labeling personnel, responsible for labeling data review; "],
        yaoqiu: ["- Bachelor degree or above; ", "- Proficient in using Python, nodejs language, and have a solid computer network foundation;", "- Familiar with Commonly used Linux commands, able to develop, deploy and test in a Linux environment; ", "- proficient in using MySQL, Redis, Mongo and other database tools; ", "- proficient in using regular expressions to obtain data from structured and unstructured data Information; ", "- Those with data mining, natural language processing, information retrieval, machine learning background are preferred. ", "- Strong sense of responsibility, proactive, good communication and teamwork skills;"],
        xinzi: ["Negotiable", "Flexible work"],
        place: "Chengdu, Xi'an, Beijing, Shanghai"
      }],
    }
  },
  methods: {
    jobDetails(item) {
      this.job.title = item.title ? item.title : ''
      this.job.zhize = item.zhize ? item.zhize : ''
      this.job.yaoqiu = item.yaoqiu ? item.yaoqiu : ''
      this.job.xinzi = item.xinzi ? item.xinzi : ''
      this.job.place = item.place ? item.place : ''
      this.jobVisible = true
      console.log(this.job.place)
    },
  }
}
</script>

