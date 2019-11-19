// Модуль реализует сериализацию и десериализацию данных.
const Application = {
	create() {
		// Функция создает корзину.
		const bin = new Bin();
		document.querySelector('.row').appendChild(bin.element);

		/* Кнопка добавления колонки с карточками */
		document
		.querySelector('[data-action-addColumn]')
		.addEventListener('click', function (event) {
			document.querySelector('.columns').append(new Column().element);

			Application.save();
		});
	},
	// Функция сохраняет состояние приложения.
	save() {
		// Объект для сохранения.
		const object = {
			// Колонки
			columns: {
				idCounter: Column.idCounter,
				items: []
			},
			// Карточки
			notes: {
				idCounter: Note.idCounter,
				items: []
			}
		}

		// Пройти по всем колонкам и добавить их в массив items объекта для сохранения.
		document
			.querySelectorAll('.column')
			.forEach(columnElement => {
				const column = {
					title: columnElement.querySelector('.column-header').textContent,
					id: parseInt(
						columnElement.getAttribute('data-column-id')
					),
					noteIds: []
				}

				/*
					Пройти по всем карточкам в колонке
					и добавить значения их атрубутов data-note-id
					в массив noteIds объекта column для сохранения.
				*/
				columnElement
					.querySelectorAll('.note')
					.forEach(noteElement => {
						column.noteIds.push(
							parseInt(noteElement.getAttribute('data-note-id'))
						);
					});

				object.columns.items.push(column);
			});

		// Пройти по всем карточкам.
		document
			.querySelectorAll('.note')
			.forEach(noteElement => {
				const note = {
					id: parseInt(
						noteElement.getAttribute('data-note-id')
					),
					content: noteElement.textContent
				}

				// Добавить элемент карточки в массив всех карточек.
				object.notes.items.push(note);
			});

		const json = JSON.stringify(object);
		localStorage.setItem('trello', json);
	},

	// Функция загружает состояние приложения.
	load() {
		if (!localStorage.getItem('trello')) {
			return;
		}

		const object = JSON.parse(localStorage.getItem('trello'));
		const getNoteById = id => object.notes.items.find(note => note.id === id);

		const columnsElement = document.querySelector('.columns');
		columnsElement.innerHTML = '';

		for (const { id, title, noteIds } of object.columns.items) {
			const column = new Column(id);
			column.element.querySelector('.column-header').textContent = title;

			columnsElement.append(column.element);

			for (const noteId of noteIds) {
				const { id, content } = getNoteById(noteId);
				const note = new Note(id, content);
				column.add(note);
			}
		}
	}
}
