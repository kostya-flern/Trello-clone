class Bin {
  constructor() {
    const element = this.element = document.createElement('div');
    element.classList.add('trash-drop');

    const image = document.createElement('img');
    image.classList.add('bin');
    image.setAttribute('data-action-bin', '');
    image.setAttribute('src', 'src/img/garbage.svg');

    element.appendChild(image);

    element.addEventListener('dragover', this.dragOverHandler.bind(this));
    element.addEventListener('drop', this.dropHandler.bind(this));
  }

  dragOverHandler(event) {
    event.preventDefault();

    if (!Column.dragged && !Note.dragged) return;

    this.element.classList.add('trash-drop_hover');
    this.element.style.animation = null;
  }

  dropHandler(event) {
    event.preventDefault();

    if (Column.dragged) {
      Column.dragged.remove();
    } else if (Note.dragged) {
      Note.dragged.remove();
    }

    this.element.classList.remove('trash-drop_hover');
    this.element.style.animation = 'trash-drop .3s';
  }
}
