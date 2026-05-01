(function () {
  const setupInterval = setInterval(() => {
    //ホームタイムラインが読み込まれるまで、一定時間毎にチェックを繰り返す
    const homeTimelineElement = document.querySelector('[data-testid="primaryColumn"] [aria-label][tabindex]');
    if(!homeTimelineElement) return;

    clearInterval(setupInterval);

    /* ホームタイムラインが読み込まれた後 */
    //history.push を取得
    const timelineHistoryPush = getProps(homeTimelineElement)?.children[0].props.history.push;

    //投稿が読み込まれるたびに呼ばれる関数
    function run(){
      const target = document.querySelectorAll('div[data-testid="cellInnerDiv"]:not([add_quotes_action_flag])');
      for (let index = 0; index < target.length; index++) {
        const target_tweet = target[index];
        const target_btn = target_tweet.querySelector('div[aria-label][role="group"][id] a[role="link"]');

        //ポストアナリティクスボタンにクリックイベントを追加
        if(target_btn){
          target_btn.addEventListener("click", (event)=>{
            event.stopImmediatePropagation();
            event.preventDefault();
            const url = new URL(target_btn.href);
            timelineHistoryPush(url.pathname.replace(/\/analytics$/, '/quotes'));
          })

          //イベント追加済みフラグを追加
          target_tweet.setAttribute("add_quotes_action_flag", "ok");
        }else{
          target_tweet.setAttribute("add_quotes_action_flag", "ng");
        }
      }
    }
    const observer = new MutationObserver(run)
    observer.observe(document.getElementById("react-root"), {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
  }, 200);
  
  
  //Props取得関数
  function getProps(elem){
    const propsKey = Object.getOwnPropertyNames(elem).find(k => k.includes(`__reactProps$`));
    return propsKey ? elem[propsKey] : null;
  }
})();
