// Модуль отвечает за обработку колонок.
class Column {
	constructor(id = null) {
		const instance = this;
		this.notes = [];

		const element = this.element = document.createElement('div');
		element.classList.add('column');
		element.setAttribute('draggable', 'true');

		if (id) {
			element.setAttribute('data-column-id', id);
		} else {
			element.setAttribute('data-column-id', Column.idCounter);
			Column.idCounter++
		}

		element.innerHTML =
			`<div class="ring-left"></div>
			<div class="ring-right"></div>
			<p class="column-header">
				В плане
			</p>
			<div data-notes></div>
			<p class="column-footer">
				<span data-action-addNote class="action">Добавить карточку</span>
			</p>`;

		const actionAddNote = element.querySelector('[data-action-addNote]');

		actionAddNote.addEventListener('click', function (event) {
			const note = new Note;
			instance.add(note);

			note.element.setAttribute('contenteditable', 'true');
			note.element.focus();
		});

		const headerElement = element.querySelector('.column-header');

		headerElement.addEventListener('dblclick', function (event) {
			element.removeAttribute('draggable');
			headerElement.setAttribute('contenteditable', 'true');
			headerElement.focus();
		});

		headerElement.addEventListener('blur', function (event) {
			headerElement.removeAttribute('contenteditable');
			element.setAttribute('draggable', 'true');

			Application.save();
		});

		element.addEventListener('dragstart', this.dragstart.bind(this));
		element.addEventListener('dragend', this.dragend.bind(this));
		element.addEventListener('dragover', this.dragover.bind(this));
		element.addEventListener('drop', this.drop.bind(this));
	}

	add(...notes) {
		for (const note of notes) {
			if (!this.notes.includes(note)) {
				this.notes.push(note);
			}

			this.element.querySelector('[data-notes]').append(note.element);
		}
	}

	dragstart(event) {
		event.stopPropagation();

		Column.dragged = this.element;
		this.element.classList.add('dragged');

		document
			.querySelectorAll('.note')
			.forEach(
				noteElement => noteElement.removeAttribute('draggable')
			);
	}

	dragend(event) {
		this.element.classList.remove('dragged');
		Column.dragged = null;
		Column.dropped = null;

		document
			.querySelectorAll('.note')
			.forEach(
				noteElement => noteElement.setAttribute('draggable', true)
			);

		document
			.querySelectorAll('.column')
			.forEach(
				columnElement => columnElement.classList.remove('under')
			);

		Application.save();
	}

	dragover(event) {
		event.preventDefault();
		event.stopPropagation();

		if (Column.dragged === this.element) {
			if (Column.dropped) {
				Column.dropped.classList.remove('under');
			}
			Column.dropped = null;
		}

		if (!Column.dragged || this.element === Column.dragged) {
			return;
		}

		Column.dropped = this.element;

		document
			.querySelectorAll('.column')
			.forEach(
				columnElement => columnElement.classList.remove('under')
			);

		this.element.classList.add('under');
	}

	drop() {
		event.stopPropagation();

		if (Note.dropped) {
			return this.element.querySelector('[data-notes]').append(Note.dropped);
		}
		else if (Column.dragged) {
			const columnsElement = document.querySelector('.columns');
			const children = Array.from(columnsElement.children);
			const indexA = children.indexOf(this.element);
			const indexB = children.indexOf(Column.dragged);

			if (indexA < indexB) {
				columnsElement.insertBefore(Column.dragged, this.element);
			} else {
				columnsElement.insertBefore(Column.dragged, this.element.nextElementSibling);
			}

			document
				.querySelectorAll('.column')
				.forEach(
					columnElement => columnElement.classList.remove('under')
				);
		}
	}
}

Column.idCounter = 4;
Column.dragged = null;
Column.dropped = null;
