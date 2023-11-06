import { Plugin } from 'obsidian';

export default class VigorPlugin extends Plugin {
	observer: MutationObserver;

	private _externalImageProcessor = () => {};

	private _addCaptionToImage = () => {
		this.registerMarkdownPostProcessor(this._externalImageProcessor);

		this.observer = new MutationObserver((mutations: MutationRecord[]) => {
			mutations.forEach((rec: MutationRecord) => {
				if (rec.type === 'childList') {
					(<Element>rec.target)
						// Search for all .image-embed nodes. Could be <div> or <span>
						.querySelectorAll(
							'.workspace-split.mod-root .markdown-reading-view img[src]',
						)
						.forEach(async (img) => {
							const imgParentNode = img.parentElement;
							const imgAlt = img.getAttr('alt');

							if (
								imgParentNode?.classList.contains(
									'image-embed',
								) ||
								!imgAlt
							) {
								return;
							}

							imgParentNode?.classList.add('image-embed');
							imgParentNode?.setAttribute('alt', imgAlt);
						});
				}
			});
		});

		this.observer.observe(document.body, {
			subtree: true,
			childList: true,
		});
	};

	async onload() {
		this._addCaptionToImage();
	}

	onunload() {
		this.observer.disconnect();
	}
}
