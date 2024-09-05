'use strict';

document.addEventListener("DOMContentLoaded", () => {
  const contactList = document.getElementById('contact-list');
  const addContactBtn = document.getElementById('add-contact');
  const deleteAllBtn = document.getElementById('delete-all');
  const popup = document.getElementById('popup');
  const closePopupBtn = document.querySelector('.close-popup');
  const contactForm = document.getElementById('contact-form');
  const popupTitle = document.getElementById('popup-title');
  const searchInput = document.getElementById('search');
  const toggleThemeBtn = document.getElementById('toggle-effect');
  const confirmPopup = document.getElementById('confirm-popup');
  const confirmDeleteBtn = document.getElementById('confirm-delete');
  const cancelDeleteBtn = document.getElementById('cancel-delete');
  const confirmMessage = confirmPopup.querySelector('p');
  let editingContact = null;
  let contactToDelete = null;
  let darkThemeActive = false;

  const contacts = [
    { name: 'Danny Cohen', phone: '054-1234567', address: '1 Herzl St, Tel Aviv', email: 'dani@example.com', notes: 'Friend from work' },
    { name: 'Michal Levi', phone: '052-2345678', address: '10 Ben Gurion St, Haifa', email: 'michal@example.com', notes: 'Cousin' },
    { name: 'Yossi Israeli', phone: '050-3456789', address: '15 Jabotinsky St, Jerusalem', email: 'yossi@example.com', notes: 'Neighbor' },
    { name: 'Nadav Regev', phone: '053-9876543', address: '20 Dizengoff St, Tel Aviv', email: 'nadav@example.com', notes: 'College friend' }
  ];

  contacts.sort((a, b) => a.name.localeCompare(b.name));

  function renderContacts(filteredContacts = contacts) {
    contactList.innerHTML = '';
    if (filteredContacts.length === 0) {
      contactList.innerHTML = '<li>List is empty</li>';
    } else {
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
            <p><strong>Address:</strong> ${contact.address || 'N/A'}</p>
            <p><strong>Email:</strong> ${contact.email || 'N/A'}</p>
            <p><strong>Notes:</strong> ${contact.notes || 'N/A'}</p>
          </div>
        `;
        contactList.appendChild(contactItem);
      });
    }
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

  function validatePhone(phone) {
    const phonePattern = /^\d{2,3}-\d{7}$/;
    return phonePattern.test(phone);
  }

  function addContact(event) {
    event.preventDefault();

    if (!contactForm.name.value || !contactForm.phone.value) {
      alert('Name and phone are required.');
      return;
    }

    if (!validatePhone(contactForm.phone.value)) {
      alert('Invalid phone number format. Use XXX-XXXXXXX.');
      return;
    }

    const existingContact = contacts.find(contact => contact.name.toLowerCase() === contactForm.name.value.toLowerCase());
    if (existingContact && editingContact === null) {
      alert('Contact with this name already exists.');
      return;
    }

    const newContact = {
      name: contactForm.name.value,
      phone: contactForm.phone.value,
      address: contactForm.address.value || '', // Optional field
      email: contactForm.email.value || '', // Optional field
      notes: contactForm.notes.value || '' // Optional field
    };

    if (editingContact !== null) {
      contacts[editingContact] = newContact;
    } else {
      contacts.push(newContact);
    }

    contacts.sort((a, b) => a.name.localeCompare(b.name));
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
    contactForm.address.value = contact.address || '';
    contactForm.email.value = contact.email || '';
    contactForm.notes.value = contact.notes || '';
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

  function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    darkThemeActive = !darkThemeActive;
  }

  addContactBtn.addEventListener('click', () => openPopup());
  closePopupBtn.addEventListener('click', closePopup);
  contactForm.addEventListener('submit', addContact);
  deleteAllBtn.addEventListener('click', () => {
    confirmMessage.textContent = 'Are you sure you want to delete all contacts?';
    confirmDeleteBtn.textContent = 'Yes, delete all';
    confirmPopup.style.display = 'flex';
    contactToDelete = null;
  });

  confirmDeleteBtn.addEventListener('click', () => {
    if (contactToDelete !== null) {
      deleteContact(contactToDelete);
      contactToDelete = null;
    } else {
      deleteAllContacts();
    }
    confirmPopup.style.display = 'none';
  });

  cancelDeleteBtn.addEventListener('click', () => {
    confirmPopup.style.display = 'none';
    contactToDelete = null;
  });

  confirmPopup.addEventListener('click', (event) => {
    if (event.target === confirmPopup) {
      confirmPopup.style.display = 'none';
      contactToDelete = null;
    }
  });

  contactList.addEventListener('click', (event) => {
    if (event.target.classList.contains('more-info')) {
      const details = event.target.closest('.contact-item').querySelector('.contact-details');
      details.style.display = details.style.display === 'block' ? 'none' : 'block';
    } else if (event.target.classList.contains('delete')) {
      const index = event.target.dataset.index;
      contactToDelete = index;
      const contact = contacts[index];
      confirmMessage.textContent = `Are you sure you want to delete ${contact.name}?`;
      confirmDeleteBtn.textContent = 'Yes, delete';
      confirmPopup.style.display = 'flex';
    } else if (event.target.classList.contains('edit')) {
      const index = event.target.dataset.index;
      editContact(index);
    }
  });

  searchInput.addEventListener('input', searchContacts);
  toggleThemeBtn.addEventListener('click', toggleTheme);

  renderContacts();
});
