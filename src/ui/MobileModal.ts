import { Modal, Platform } from 'obsidian';

/**
 * フォーカスした瞬間に確保する余白（画面高さに対する割合）。
 * ソフトキーボードのおおよその高さを画面全体の比率で見積もった、固定の概算値。
 */
const KEYBOARD_PADDING_RATIO = 0.45;

/**
 * モバイル（Obsidian mobile app）でのモーダル表示・操作性を改善する共通処理。
 * デスクトップでは何もしない（見た目・挙動は一切変更しない）。
 *
 * 対応内容:
 *
 * 1. モーダルの表示位置を画面中央ではなく画面上部起点にする。
 *
 * 2. モーダル内の「入力系要素以外」をタップすると、フォーカス中の
 *    入力欄からフォーカスを外し、ソフトキーボードを閉じる。
 *
 * 3. input / textarea / select がフォーカスされたら、既にスクロール可能な
 *    `.modal-content`（= contentEl）に、画面高さの一定割合ぶんの
 *    padding-bottom を追加してから、その要素を画面内へスクロールする。
 *
 *    当初は window.visualViewport（ソフトキーボード表示中の実際の
 *    表示範囲を取得できる API）を使って正確なキーボード高さを計算し、
 *    それに合わせて padding を動的に増減させる方式を試みたが、
 *    実機で検証したところ、resize/scroll イベントは発火するものの
 *    ビューポート高さの値自体がキーボードの開閉と連動しておらず
 *    （常に overlap=0 を返す）、むしろ「一度確保した余白を誤って
 *    縮めてしまい、入力欄が再びキーボードに隠れる」という不具合を
 *    引き起こすことが確認された。そのため visualViewport には一切
 *    依存せず、固定比率のフォールバックのみで動作するようにしている。
 *
 * 呼び出し側の onOpen() で、要素をすべて描画し終えたあとに1回呼び出す。
 */
export function applyMobileModalBehavior(modal: Modal): void {
    if (!Platform.isMobile) return;

    const { containerEl, modalEl, contentEl } = modal;

    // 1. 表示位置を画面上部起点にする
    containerEl.addClass('fb-modal-container-top');

    // 2. 空きスペースのタップでソフトキーボードを閉じる
    modalEl.addEventListener('click', (evt) => {
        const target = evt.target as HTMLElement;
        if (target.closest('input, textarea, select, button, a, label')) return;
        const active = document.activeElement as HTMLElement | null;
        if (active && contentEl.contains(active) && typeof active.blur === 'function') {
            active.blur();
        }
    });

    // 3. ソフトキーボード対策（固定比率の padding-bottom のみで運用する）
    contentEl.addEventListener('focusin', (evt) => {
        const target = evt.target as HTMLElement;
        if (!target.matches('input, textarea, select')) return;

        contentEl.style.setProperty('padding-bottom', `${Math.round(window.innerHeight * KEYBOARD_PADDING_RATIO)}px`);

        // block: 'nearest' にすることで、必要最小限の距離しか動かさない
        // （'center' だと大きく動かしすぎて、その反動で少し戻る動きが目立ちやすい）。
        const scrollToField = (): void => {
            const active = document.activeElement as HTMLElement | null;
            if (active === target) {
                target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        };

        // ソフトキーボードのアニメーション中に一度、アニメーション完了後にもう一度スクロールする。
        // 2回目は、iOS 側がフォーカス時に独自に行う自動スクロール調整が
        // 終わったあとの最終位置を微調整するためのもの。
        window.setTimeout(scrollToField, 300);
        window.setTimeout(scrollToField, 450);
    });

    // フォーカスが外れた際、モーダル内の他の入力欄に移っていなければ余白を解除する
    contentEl.addEventListener('focusout', () => {
        window.setTimeout(() => {
            const active = document.activeElement as HTMLElement | null;
            if (!active || !contentEl.contains(active) || !active.matches('input, textarea, select')) {
                contentEl.style.removeProperty('padding-bottom');
            }
        }, 50);
    });
}
