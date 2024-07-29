import './meta.js?userscript-metadata';
import { loadOml2d } from 'oh-my-live2d';
import { MovementManager } from './movementmanager';

const defines = {
  canvasTag: 'canvas',
  canvasClass: 'haruna-canvas',
  canvasNewId: 'oml2d-canvas',
  canvasNewContainerTag: 'div',
  canvasNewContainerClass: 'aside-area',
  canvasNewContainerId: 'aside-area-vm',
  get canvasSelectorByClass() {
    return `${this.canvasTag}.${this.canvasClass}`;
  },
  get canvasNewSelectorById() {
    return `${this.canvasTag}#${this.canvasNewId}`;
  },
  get canvasNewContainerSelectorByClass() {
    return `${this.canvasNewContainerTag}.${this.canvasNewContainerClass}`;
  },
  get canvasNewContainerSelectorById() {
    return `${this.canvasNewContainerTag}#${this.canvasNewContainerId}`;
  },
  modelScale: 0.3,
  modelPositionX: 10,
  modelPositionY: 100,
  tipsWidth: '100px',
  tipsHeight: '20px',
  assetsAddressBase:
    'https://fastly.jsdelivr.net/gh/arenekosreal/2233.zenra/assets/',
  msgs: [
    '你要干嘛呀？',
    '鼠…鼠标放错地方了！',
    '喵喵喵？',
    '萝莉控是什么呀？',
    '怕怕',
    '你看到我的小熊了吗？',
  ],
};
const config = {
  forceAdd: true,
};

enum CharacterType {
  C22 = '22',
  C33 = '33',
}

function getAssetsAddress(character: CharacterType, large: boolean) {
  const modifier = large ? '@2x' : '';
  console.log('角色类型：', character, modifier);
  return `${defines.assetsAddressBase}${character}/${character}.zenra${modifier}.json`;
}

function getCharacterType(): CharacterType {
  const roomId =
    window.BilibiliLive?.ROOMID ?? parseInt(location.pathname.split('/')[1]);
  console.log('房间ID：', roomId);
  const apiEndpoint = `https://api.live.bilibili.com/live/getRoomKanBanModel?roomid=${roomId}`;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', apiEndpoint, false);
  xhr.send();

  let rawLabel: string | null = null;
  let characterType: CharacterType;
  if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    rawLabel = JSON.parse(xhr.responseText).label;
  }
  switch (rawLabel) {
    case '33':
      characterType = CharacterType.C33;
      break;
    default:
      characterType = CharacterType.C22;
  }
  return characterType;
}

function loadModel(parentElement: HTMLElement) {
  const character = getCharacterType();
  const oml2d = loadOml2d({
    dockedPosition: 'right',
    menus: {
      disable: true,
    },
    models: [
      {
        name: character,
        path: getAssetsAddress(character, window.devicePixelRatio > 1),
        scale: defines.modelScale,
        position: [defines.modelPositionX, defines.modelPositionY],
      },
    ],
    parentElement: parentElement,
    statusBar: {
      disable: true,
    },
    tips: {
      copyTips: {
        duration: 0,
      },
      idleTips: {
        duration: 0,
      },
      messageLine: 1,
      style: {
        minHeight: defines.tipsHeight,
        minWidth: defines.tipsWidth,
      },
      welcomeTips: {
        duration: 0,
        message: {},
      },
    },
    transitionTime: 0,
  });

  const newCanvas = document.querySelector(defines.canvasNewSelectorById);
  newCanvas.classList.add(defines.canvasClass);
  newCanvas.addEventListener('click', () => {
    const i = Math.floor(Math.random() * defines.msgs.length);
    oml2d.tipsMessage(defines.msgs[i], 1000, 5);
  });
  const movementManager = new MovementManager(newCanvas.parentElement);
  oml2d.onStageSlideIn(movementManager.overrideHandlers);
  oml2d.onStageSlideOut(movementManager.resetHandlers);
  console.log('没穿衣服的2233添加完成');
}

function onVMObserveTriggered(
  mutationsList: MutationRecord[],
  observer: MutationObserver,
) {
  for (const record of mutationsList) {
    for (const node of record.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeName === defines.canvasTag.toUpperCase()) {
          const canvasElement = node as HTMLCanvasElement;
          if (canvasElement.classList.contains(defines.canvasClass)) {
            console.log('发现2233，删除已有元素');
            const parentElement = canvasElement.parentElement;
            parentElement.removeChild(canvasElement);
            loadModel(parentElement);
            observer.disconnect();
            return;
          }
        }
      }
    }
  }
}

function onReadyStateChanged() {
  if (document.readyState === 'complete') {
    console.log('网页已经完成加载，终止MutationObserver');
    observer.disconnect();
    const containerElement = document.querySelector(
      defines.canvasNewContainerSelectorById,
    );
    if (containerElement && config.forceAdd) {
      console.log('未发现2233，强制添加');
      loadModel(containerElement as HTMLElement);
      document.removeEventListener('readystatechange', onReadyStateChanged);
    }
  }
}

const observer = new MutationObserver(onVMObserveTriggered);
observer.observe(document.body, { childList: true, subtree: true });
console.log('[2233.zenra] 已注册观察回调');
document.addEventListener('readystatechange', onReadyStateChanged);
console.log('[2233.zenra] 已注册状态改变回调');
