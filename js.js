'use strict';

document.addEventListener("DOMContentLoaded", () => {
  const contactList = document.getElementById('contact-list'); // Contact list element
  const addContactBtn = document.getElementById('add-contact'); // Button to add a new contact
  const deleteAllBtn = document.getElementById('delete-all'); // Button to delete all contacts
  const popup = document.getElementById('popup'); // Popup for adding/editing a contact
  const closePopupBtn = document.querySelector('.close-popup'); // Button to close the popup
  const contactForm = document.getElementById('contact-form'); // Form for adding/editing a contact
  const popupTitle = document.getElementById('popup-title'); // Title of the popup
  const searchInput = document.getElementById('search'); // Search input field
  const toggleThemeBtn = document.getElementById('toggle-effect'); // Button to toggle between themes
  const confirmPopup = document.getElementById('confirm-popup'); // Popup for delete confirmation
  const confirmDeleteBtn = document.getElementById('confirm-delete'); // Button to confirm deletion
  const cancelDeleteBtn = document.getElementById('cancel-delete'); // Button to cancel deletion
  const confirmMessage = confirmPopup.querySelector('p'); // Message in the confirmation popup
  let editingContact = null; // Index of the contact being edited, if any
  let contactToDelete = null; // Index of the contact to delete, if any
  let darkThemeActive = false; // Boolean to track the theme state

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
    contactList.innerHTML = ''; // Clear the current list
    filteredContacts.forEach((contact, index) => {
      const contactItem = document.createElement('li'); // Create a new list item for the contact
      contactItem.classList.add('contact-item'); // Add a class to the list item
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
      contactList.appendChild(contactItem); // Append the contact item to the list

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
    popup.style.display = 'flex'; // Show the popup
    popupTitle.textContent = editing ? 'Edit Contact' : 'Add Contact'; // Set the popup title
    if (!editing) {
      contactForm.reset(); // Reset the form if not editing
      editingContact = null; // Clear the editing index
    }
  }

  // Close the popup
  function closePopup() {
    popup.style.display = 'none'; // Hide the popup
  }

  // Add or edit a contact
  function addContact(event) {
    event.preventDefault(); // Prevent form submission

    // Check if the name already exists
    const existingContact = contacts.find(contact => contact.name.toLowerCase() === contactForm.name.value.toLowerCase());
    if (existingContact && editingContact === null) {
      alert('Contact with this name already exists.'); // Show an alert if the name exists
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
      contacts[editingContact] = newContact; // Update the contact if editing
    } else {
      contacts.push(newContact); // Add the contact if not editing
    }

    contacts.sort((a, b) => a.name.localeCompare(b.name)); // Re-sort contacts
    renderContacts(); // Re-render the contact list
    closePopup(); // Close the popup
  }

  // Delete a specific contact
  function deleteContact(index) {
    contacts.splice(index, 1); // Remove the contact from the array
    renderContacts(); // Re-render the contact list
  }

  // Delete all contacts
  function deleteAllContacts() {
    contacts.length = 0; // Clear the contacts array
    renderContacts(); // Re-render the contact list
  }

  // Edit a contact
  function editContact(index) {
    const contact = contacts[index]; // Get the contact to edit
    editingContact = index; // Set the editing index
    contactForm.name.value = contact.name; // Populate the form with contact details
    contactForm.phone.value = contact.phone;
    contactForm.address.value = contact.address;
    contactForm.email.value = contact.email;
    contactForm.notes.value = contact.notes;
    openPopup(true); // Open the popup in edit mode
  }

  // Search contacts
  function searchContacts() {
    const query = searchInput.value.toLowerCase(); // Get the search query
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(query) ||
      contact.phone.toLowerCase().includes(query) ||
      contact.address.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.notes.toLowerCase().includes(query)
    );
    renderContacts(filteredContacts); // Re-render the contact list with the filtered contacts
  }

  // Toggle theme between light and dark
  function toggleTheme() {
    document.body.classList.toggle('dark-theme'); // Toggle the theme class on the body
    darkThemeActive = !darkThemeActive; // Update the theme state
  }

  // Event listeners
  addContactBtn.addEventListener('click', () => openPopup()); // Open the popup when add button is clicked
  closePopupBtn.addEventListener('click', closePopup); // Close the popup when close button is clicked
  contactForm.addEventListener('submit', addContact); // Handle form submission for adding/editing a contact

  // Handle delete all button click
  deleteAllBtn.addEventListener('click', () => {
    confirmMessage.textContent = 'Are you sure you want to delete all contacts?'; // Set the confirmation message
    confirmDeleteBtn.textContent = 'Yes, delete all'; // Set the confirmation button text
    confirmPopup.style.display = 'flex'; // Show the confirmation popup
    contactToDelete = null; // Clear the specific contact to delete
  });

  // Handle confirmation of deletion
  confirmDeleteBtn.addEventListener('click', () => {
    if (contactToDelete !== null) {
      deleteContact(contactToDelete); // Delete the specific contact if set
      contactToDelete = null; // Clear the contact to delete
    } else {
      deleteAllContacts(); // Delete all contacts if no specific contact is set
    }
    confirmPopup.style.display = 'none'; // Hide the confirmation popup
  });

  // Handle cancellation of deletion
  cancelDeleteBtn.addEventListener('click', () => {
    confirmPopup.style.display = 'none'; // Hide the confirmation popup
    contactToDelete = null; // Clear the specific contact to delete
  });

  // Close the confirmation popup when clicking outside of it
  confirmPopup.addEventListener('click', (event) => {
    if (event.target === confirmPopup) {
      confirmPopup.style.display = 'none'; // Hide the confirmation popup
      contactToDelete = null; // Clear the specific contact to delete
    }
  });

  // Handle click events on the contact list
  contactList.addEventListener('click', (event) => {
    if (event.target.classList.contains('more-info')) {
      const details = event.target.closest('.contact-item').querySelector('.contact-details'); // Get the details element
      details.style.display = details.style.display === 'block' ? 'none' : 'block'; // Toggle the details visibility
    } else if (event.target.classList.contains('delete')) {
      const index = event.target.dataset.index; // Get the index of the contact to delete
      contactToDelete = index; // Set the contact to delete
      const contact = contacts[index]; // Get the contact details
      confirmMessage.textContent = `Are you sure you want to delete ${contact.name}?`; // Set the confirmation message
      confirmDeleteBtn.textContent = 'Yes, delete'; // Set the confirmation button text
      confirmPopup.style.display = 'flex'; // Show the confirmation popup
    } else if (event.target.classList.contains('edit')) {
      const index = event.target.dataset.index; // Get the index of the contact to edit
      editContact(index); // Edit the contact
    }
  });

  // Handle search input
  searchInput.addEventListener('input', searchContacts); // Filter contacts based on search input

  // Handle theme toggle button click
  toggleThemeBtn.addEventListener('click', toggleTheme); // Toggle the theme when button is clicked

  // Initial render of contacts
  renderContacts(); // Render the contact list on page load
});

