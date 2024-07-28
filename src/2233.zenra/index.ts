import './meta.js?userscript-metadata';
import { loadOml2d } from 'oh-my-live2d';
import { MovementManager } from './movementmanager';

const defines = {
  canvasClass: 'haruna-canvas',
  canvasSelector: 'canvas.haruna-canvas',
  canvasId: '#oml2d-canvas',
  canvasNewContainerSelector: 'div.aside-area',
  canvasWidth: 400,
  canvasHeight: 500,
  assetsAddressBase:
    'https://fastly.jsdelivr.net/gh/arenekosreal/2233.zenra/assets/',
  msgs: [
    '你要干嘛呀？',
    '鼠…鼠标放错地方了！',
    '喵喵喵？',
    '萝莉控是什么呀？',
    '怕怕',
    '你看到我的小熊了吗',
  ],
};
const config = {
  forceAdd: true,
};
let needReplace = true;

enum CharacterType {
  C22 = '22',
  C33 = '33',
}

function getAssetsAddress(character: CharacterType, large: boolean) {
  const modifier = large ? '@2x' : '';
  console.log('角色类型：' + character + modifier);
  return `${defines.assetsAddressBase}${character}/${character}.zenra${modifier}.json`;
}

function getCharacterType(): CharacterType {
  const apiEndpoint = `https://api.live.bilibili.com/live/getRoomKanBanModel?roomid=${window.BilibiliLive.ROOMID}`;
  let characterType: CharacterType;
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.onload = (_) => {
    const rawLabel = xhr.response.label;
    switch (rawLabel) {
      case '33':
        characterType = CharacterType.C33;
        break;
      default:
        characterType = CharacterType.C22;
    }
  };
  xhr.open('GET', apiEndpoint);
  xhr.send();
  return characterType;
}

function onVMObserveTriggered(
  _: MutationRecord[],
  __: MutationObserver,
): boolean {
  const canvas = document.querySelectorAll(defines.canvasSelector);
  if (needReplace) {
    let parentElement: HTMLElement;
    if (canvas.length > 0) {
      console.log('发现2233，删除已有元素');
      const canvasElement = canvas[0];
      parentElement = canvasElement.parentElement;
      parentElement.removeChild(canvasElement);
    } else if (config.forceAdd) {
      console.log('未发现2233，强制添加');
      parentElement = document.querySelector(
        defines.canvasNewContainerSelector,
      );
      if (!parentElement) {
        return false;
      }
    } else {
      console.log('未发现2233，且不强制添加');
      return true;
    }

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
          stageStyle: {
            width: defines.canvasWidth,
            height: defines.canvasHeight,
          },
        },
      ],
      parentElement: parentElement,
      statusBar: {
        disable: true,
      },
      tips: {
        style: {
          textOverflow: 'ellipsis',
          minHeight: '0px',
        },
      },
      transitionTime: 0,
    });

    const newCanvas: HTMLCanvasElement = document.querySelector(
      `canvas${defines.canvasId}`,
    );
    newCanvas.className = defines.canvasClass;
    const movementManager = new MovementManager(newCanvas.parentElement);
    window.addEventListener(
      'DOMContentLoaded',
      movementManager.overrideHandlers,
    );
    window.addEventListener('beforeunload', movementManager.resetHandlers);
    newCanvas.addEventListener('click', () => {
      const i = Math.floor(Math.random() * defines.msgs.length);
      oml2d.tipsMessage(defines.msgs[i], 1000, 5);
    });
    console.log('没穿衣服的2233添加完成');
    needReplace = false;
  }
  return true;
}

console.log('[2233.zenra] 正在等待目标');
const _ = VM.observe(document.body, onVMObserveTriggered);
