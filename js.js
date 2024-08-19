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
  let editingContact = null;
  let darkThemeActive = false;

  // Initial set of contacts
  const contacts = [
    { name: 'Danny Cohen', phone: '054-1234567', address: '1 Herzl St, Tel Aviv', email: 'dani@example.com', notes: 'Friend from work' },
    { name: 'Michal Levi', phone: '052-2345678', address: '10 Ben Gurion St, Haifa', email: 'michal@example.com', notes: 'Cousin' },
    { name: 'Yossi Israeli', phone: '050-3456789', address: '15 Jabotinsky St, Jerusalem', email: 'yossi@example.com', notes: 'Neighbor' },
    { name: 'Nadav Regev', phone: '053-9876543', address: '20 Dizengoff St, Tel Aviv', email: 'nadav@example.com', notes: 'College friend' }
  ];

  // Sort contacts by name
  contacts.sort((a, b) => a.name.localeCompare(b.name));

  // Render contacts in the contact list
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

      // Add event listeners for hover effect
      contactItem.addEventListener('mouseover', () => {
        contactItem.classList.add('hovered');
      });

      contactItem.addEventListener('mouseout', () => {
        contactItem.classList.remove('hovered');
      });
    });
  }

  // Open the popup for adding or editing a contact
  function openPopup(editing = false) {
    popup.style.display = 'flex';
    popupTitle.textContent = editing ? 'Edit Contact' : 'Add Contact';
    if (!editing) {
      contactForm.reset();
      editingContact = null;
    }
  }

  // Close the popup
  function closePopup() {
    popup.style.display = 'none';
  }

  // Add or edit a contact
  function addContact(event) {
    event.preventDefault();

    // Check if the name already exists
    const existingContact = contacts.find(contact => contact.name.toLowerCase() === contactForm.name.value.toLowerCase());
    if (existingContact && editingContact === null) {
      alert('Contact with this name already exists.');
      return;
    }

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

    contacts.sort((a, b) => a.name.localeCompare(b.name));
    renderContacts();
    closePopup();
  }

  // Delete a contact
  function deleteContact(index) {
    contacts.splice(index, 1);
    renderContacts();
  }

  // Delete all contacts
  function deleteAllContacts() {
    contacts.length = 0;
    renderContacts();
  }

  // Edit a contact
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

  // Search contacts
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

  // Toggle theme between light and dark
  function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    darkThemeActive = !darkThemeActive;
  }

  // Event listeners
  addContactBtn.addEventListener('click', () => openPopup());
  closePopupBtn.addEventListener('click', closePopup);
  contactForm.addEventListener('submit', addContact);
  deleteAllBtn.addEventListener('click', deleteAllContacts);
  searchInput.addEventListener('input', searchContacts);
  toggleThemeBtn.addEventListener('click', toggleTheme);

  contactList.addEventListener('click', (event) => {
    if (event.target.classList.contains('more-info')) {
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

  // Initial render of contacts
  renderContacts();
});
