<template>
  <div class="py-[20px] overflow-scroll">
    <!-- <gradio-app src="http://gradio-test-app-v1-0.spaces.opencsg.com/"></gradio-app> -->
    <iframe
      src="http://gradio-test-app-v1-0.spaces.opencsg.com/"
      id="application-space-iframe"
      frameborder="0"
      width="850"
      height="450"
    ></iframe>
  </div>
</template>

<script setup>
  import { useCookies } from "vue3-cookies";
  import { onMounted } from "vue";
  const { cookies } = useCookies();

  const props = defineProps({
    appEndpoint: String
  })

  onMounted(() => {
    const iframeWindow = document.getElementById("application-space-iframe").contentWindow;
    const xhr = new iframeWindow.XMLHttpRequest();
    xhr.open("GET", "http://gradio-test-app-v1-0.spaces.opencsg.com/");
    xhr.setRequestHeader("Authorization", `Bearer ${cookies.get('user_token')}`);
    xhr.onload = function() {
      debugger
      if (xhr.status === 200) {
          // Handle successful response
          console.log("Request successful:", xhr.responseText);
      } else {
          // Handle other status codes (e.g., 404, 500, etc.)
          console.error("Request failed with status:", xhr.status);
      }
    };
    xhr.send();
  })

  // const handler = () => {
  //   debugger
  //   if (this.readyState === this.DONE) {
  //     if (this.status === 200) {
  //       // 从响应中创建 Blob URL
  //       const dataUrl = URL.createObjectURL(this.response);
  //       // 设置 iframe 的源
  //       document.querySelector('#application-space-iframe').src = dataUrl;
  //     } else {
  //       console.error('获取内容失败。');
  //     }
  //   }
  // }

  // const xhr = new XMLHttpRequest();
  // const method = 'GET';
  // const url = 'http://gradio-test-app-v1-0.spaces.opencsg.com/'
  // // const url = props.appEndpoint
  // console.log(url)
  // xhr.open(method, url, true);
  // xhr.setRequestHeader('Authorization', 'Bearer ' + cookies.get('user_token'));
  // // xhr.responseType = 'blob';

  // xhr.onreadystatechange = function () {
  //   if (xhr.readyState === XMLHttpRequest.DONE) {
  //     if (xhr.status === 200) {
  //     // Request completed successfully
  //     // const dataUrl = URL.createObjectURL(xhr.response);
  //     // console.log(dataUrl)
  //     const iframeElement = document.getElementById('application-space-iframe')
  //     debugger
  //     iframeElement.srcdoc = xhr.response;
  //   } else {
  //     // Error handling (e.g., handle non-200 status codes)
  //     console.error('Error fetching data:', xhr.status, xhr.statusText);
  //   }
  //   }
  // }

  // xhr.send()



  // console.log(props.appEndpoint)

  // onMounted(() => {
  //   const iframeGradioApp = document.querySelector('iframe');
  //   // const gradioIframe = gradioApp.shadowRoot.querySelector('iframe');

  //   iframeGradioApp.addEventListener('load', () => {
  //     const iframeWindow = iframeGradioApp.contentWindow;
  //     const iframeFetch = iframeWindow.fetch;

  //     iframeWindow.fetch = function (url, options) {
  //       const customHeaders = {
  //         Authorization: `Bearer ${cookies.get('user_token')}`,
  //       };

  //       options.headers = {
  //         ...options.headers,
  //         ...customHeaders,
  //       };

  //       return iframeFetch(url, options);
  //     };
  //   });
</script>