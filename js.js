document.addEventListener("DOMContentLoaded", () => {
  const contactList = document.getElementById('contact-list');
  const addContactBtn = document.getElementById('add-contact');
  const deleteAllBtn = document.getElementById('delete-all');
  const popup = document.getElementById('popup');
  const closePopupBtn = document.querySelector('.close-popup');
  const contactForm = document.getElementById('contact-form');
  const popupTitle = document.getElementById('popup-title');
  const searchInput = document.getElementById('search');
  let editingContact = null;

  const contacts = [
    { name: 'Danny Cohen', phone: '054-1234567', address: '1 Herzl St, Tel Aviv', email: 'dani@example.com', notes: 'Friend from work' },
    { name: 'Michal Levi', phone: '052-2345678', address: '10 Ben Gurion St, Haifa', email: 'michal@example.com', notes: 'Cousin' },
    { name: 'Yossi Israeli', phone: '050-3456789', address: '15 Jabotinsky St, Jerusalem', email: 'yossi@example.com', notes: 'Neighbor' }
  ];

  function renderContacts(filteredContacts = contacts) {
    contactList.innerHTML = '';
    filteredContacts.forEach((contact, index) => {
      const contactItem = document.createElement('li');
      contactItem.classList.add('contact-item');
      contactItem.innerHTML = `
        <div class="contact-summary">
          <span>${contact.name} - ${contact.phone}</span>
          <div class="buttons">
            <button class="more-info" data-index="${index}">More Info</button>
            <button class="edit" data-index="${index}">Edit</button>
            <button class="delete" data-index="${index}">Delete</button>
          </div>
        </div>
        <div class="contact-details">
          <p><strong>Address:</strong> ${contact.address}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Notes:</strong> ${contact.notes}</p>
        </div>
      `;
      contactList.appendChild(contactItem);
    });
  }

  function openPopup(editing = false) {
    popup.style.display = 'flex';
    popupTitle.textContent = editing ? 'Edit Contact' : 'Add Contact';
    if (!editing) {
      contactForm.reset();
      editingContact = null;
    }
  }

  function closePopup() {
    popup.style.display = 'none';
  }

  function addContact(event) {
    event.preventDefault();
    const newContact = {
      name: contactForm.name.value,
      phone: contactForm.phone.value,
      address: contactForm.address.value,
      email: contactForm.email.value,
      notes: contactForm.notes.value
    };

    if (editingContact !== null) {
      contacts[editingContact] = newContact;
    } else {
      contacts.push(newContact);
    }

    renderContacts();
    closePopup();
  }

  function deleteContact(index) {
    contacts.splice(index, 1);
    renderContacts();
  }

  function deleteAllContacts() {
    contacts.length = 0;
    renderContacts();
  }

  function editContact(index) {
    const contact = contacts[index];
    editingContact = index;
    contactForm.name.value = contact.name;
    contactForm.phone.value = contact.phone;
    contactForm.address.value = contact.address;
    contactForm.email.value = contact.email;
    contactForm.notes.value = contact.notes;
    openPopup(true);
  }

  function searchContacts() {
    const query = searchInput.value.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query) ||
      contact.address.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.notes.toLowerCase().includes(query)
    );
    renderContacts(filteredContacts);
  }

  addContactBtn.addEventListener('click', () => openPopup());
  closePopupBtn.addEventListener('click', closePopup);
  contactForm.addEventListener('submit', addContact);
  deleteAllBtn.addEventListener('click', deleteAllContacts);
  searchInput.addEventListener('input', searchContacts);

  contactList.addEventListener('click', (event) => {
    if (event.target.classList.contains('more-info')) {
      const index = event.target.dataset.index;
      const details = event.target.closest('.contact-item').querySelector('.contact-details');
      details.style.display = details.style.display === 'block' ? 'none' : 'block';
    } else if (event.target.classList.contains('delete')) {
      const index = event.target.dataset.index;
      deleteContact(index);
    } else if (event.target.classList.contains('edit')) {
      const index = event.target.dataset.index;
      editContact(index);
    }
  });

  renderContacts();
});
