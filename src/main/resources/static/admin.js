const API_BASE = 'http://localhost:8080/api';
let currentTab = 'communities';
let currentEditId = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin page loaded, initializing...');
    loadAllDropdowns();
});

function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    loadAllDropdowns();
}

async function loadAllDropdowns() {
    const loaders = {
        'communities': loadCommunitiesDropdown,
        'categories': loadCategoriesDropdown,
        'subcategories': loadSubcategoriesDropdown,
        'providers': loadProvidersDropdown,
        'services': loadServicesDropdown,
        'recommendations': loadRecommendationsDropdown,
        'community-services': loadCommunityServicesDropdown
    };
    if (loaders[currentTab]) await loaders[currentTab]();
}

function showMessage(tab, message, type = 'success') {
    const messageEl = document.getElementById(`${tab}-message`);
    messageEl.textContent = message;
    messageEl.className = `message ${type} active`;
    setTimeout(() => messageEl.classList.remove('active'), 5000);
}

function cancelForm(tab) {
    document.getElementById(`${tab}-form`).classList.remove('active');
    currentEditId = null;
}

// Helper functions
async function loadCategoriesForForm() {
    const response = await fetch(`${API_BASE}/categories`);
    return await response.json();
}

async function loadSubcategoriesForForm() {
    const response = await fetch(`${API_BASE}/subcategories`);
    return await response.json();
}

async function loadProvidersForForm() {
    const response = await fetch(`${API_BASE}/providers`);
    return await response.json();
}

async function loadServicesForForm() {
    const response = await fetch(`${API_BASE}/services`);
    return await response.json();
}

async function loadCommunitiesForForm() {
    const response = await fetch(`${API_BASE}/communities`);
    return await response.json();
}

// COMMUNITIES
async function loadCommunitiesDropdown() {
    console.log('Loading all communities...');
    try {
        const response = await fetch(`${API_BASE}/communities`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const communities = await response.json();
        console.log('Communities loaded:', communities.length);
        
        // Display ALL communities in table by default
        displayCommunityTable(communities);
        
        // Populate city and area dropdowns
        const cities = [...new Set(communities.map(c => c.city).filter(Boolean))].sort();
        const areas = [...new Set(communities.map(c => c.area).filter(Boolean))].sort();
        
        const citySelect = document.getElementById('communities-filter-city');
        const areaSelect = document.getElementById('communities-filter-area');
        
        citySelect.innerHTML = '<option value="all">All</option>';
        cities.forEach(city => {
            citySelect.innerHTML += `<option value="${city}">${city}</option>`;
        });
        
        areaSelect.innerHTML = '<option value="all">All</option>';
        areas.forEach(area => {
            areaSelect.innerHTML += `<option value="${area}">${area}</option>`;
        });
        
        // Store all communities for client-side filtering
        window.allCommunities = communities;
    } catch (error) {
        console.error('Error loading communities:', error);
        showMessage('communities', 'Error loading communities: ' + error.message, 'error');
    }
}

async function filterCommunities() {
    const status = document.getElementById('communities-filter-status').value;
    const city = document.getElementById('communities-filter-city').value;
    const area = document.getElementById('communities-filter-area').value;
    
    if (!window.allCommunities) {
        await loadCommunitiesDropdown();
        return;
    }
    
    // Start with all communities
    let filtered = [...window.allCommunities];
    
    // Apply status filter
    if (status === 'active') {
        filtered = filtered.filter(c => c.isActive === true);
    }
    
    // Apply city filter
    if (city !== 'all') {
        filtered = filtered.filter(c => c.city === city);
    }
    
    // Apply area filter
    if (area !== 'all') {
        filtered = filtered.filter(c => c.area === area);
    }
    
    displayCommunityTable(filtered);
}

async function loadCommunityDetails() {
    // This function is no longer needed but kept for compatibility
    filterCommunities();
}

function displayCommunityTable(communities) {
    const container = document.getElementById('communities-table');
    if (communities.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No communities found</h3></div>';
        return;
    }
    let html = '<table><thead><tr><th>ID</th><th>Name</th><th>City</th><th>Area</th><th>Description</th><th>Active</th><th>Actions</th></tr></thead><tbody>';
    communities.forEach(c => {
        html += `<tr id="community-row-${c.communityId}">
            <td>${c.communityId}</td>
            <td>${c.communityName}</td>
            <td>${c.city}</td>
            <td>${c.area || 'N/A'}</td>
            <td>${c.description || 'N/A'}</td>
            <td>${c.isActive ? '✅' : '❌'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-primary" onclick="editCommunityInline(${c.communityId})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCommunity(${c.communityId})">Delete</button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function showAddForm(tab) {
    currentEditId = null;
    const formContainer = document.getElementById(`${tab}-form`);
    
    if (tab === 'communities') {
        formContainer.innerHTML = `<h3>Add New Community</h3>
            <div class="form-group"><label>Community Name *</label><input type="text" id="communityName" required></div>
            <div class="form-group"><label>City *</label><input type="text" id="city" required></div>
            <div class="form-group"><label>Area</label><input type="text" id="area"></div>
            <div class="form-group"><label>Description</label><textarea id="description"></textarea></div>
            <div class="form-actions"><button class="btn btn-success" onclick="saveCommunity()">Save</button>
            <button class="btn btn-secondary" onclick="cancelForm('${tab}')">Cancel</button></div>`;
    } else if (tab === 'categories') {
        formContainer.innerHTML = `<h3>Add New Category</h3>
            <div class="form-group"><label>Category Name *</label><input type="text" id="categoryName" required></div>
            <div class="form-group"><label>Category Type</label><input type="text" id="categoryType"></div>
            <div class="form-group"><label>Description</label><textarea id="description"></textarea></div>
            <div class="form-actions"><button class="btn btn-success" onclick="saveCategory()">Save</button>
            <button class="btn btn-secondary" onclick="cancelForm('${tab}')">Cancel</button></div>`;
    } else if (tab === 'subcategories') {
        loadCategoriesForForm().then(categories => {
            formContainer.innerHTML = `<h3>Add New Subcategory</h3>
                <div class="form-group"><label>Category *</label><select id="categoryId" required><option value="">Select category...</option>
                ${categories.map(c => `<option value="${c.categoryId}">${c.categoryName}</option>`).join('')}</select></div>
                <div class="form-group"><label>Subcategory Name *</label><input type="text" id="subcategoryName" required></div>
                <div class="form-group"><label>Description</label><textarea id="description"></textarea></div>
                <div class="form-actions"><button class="btn btn-success" onclick="saveSubcategory()">Save</button>
                <button class="btn btn-secondary" onclick="cancelForm('${tab}')">Cancel</button></div>`;
        });
    } else if (tab === 'providers') {
        formContainer.innerHTML = `<h3>Add New Provider</h3>
            <div class="form-group"><label>Provider Name *</label><input type="text" id="providerName" required></div>
            <div class="form-group"><label>Contact Person</label><input type="text" id="contactPerson"></div>
            <div class="form-group"><label>Phone Number</label><input type="text" id="phoneNumber"></div>
            <div class="form-group"><label>Email</label><input type="email" id="email"></div>
            <div class="form-group"><label>WhatsApp Number</label><input type="text" id="whatsappNumber"></div>
            <div class="form-group"><label>Address Line 1</label><input type="text" id="addressLine1"></div>
            <div class="form-group"><label>Address Line 2</label><input type="text" id="addressLine2"></div>
            <div class="form-group"><label>City *</label><input type="text" id="city" required></div>
            <div class="form-group"><label>Area</label><input type="text" id="area"></div>
            <div class="form-group"><label>Description</label><textarea id="description"></textarea></div>
            <div class="form-actions"><button class="btn btn-success" onclick="saveProvider()">Save</button>
            <button class="btn btn-secondary" onclick="cancelForm('${tab}')">Cancel</button></div>`;
    } else if (tab === 'services') {
        Promise.all([loadProvidersForForm(), loadSubcategoriesForForm()]).then(([providers, subcategories]) => {
            formContainer.innerHTML = `<h3>Add New Service</h3>
                <div class="form-group"><label>Provider *</label><select id="providerId" required><option value="">Select provider...</option>
                ${providers.map(p => `<option value="${p.providerId}">${p.providerName}</option>`).join('')}</select></div>
                <div class="form-group"><label>Subcategory *</label><select id="subcategoryId" required><option value="">Select subcategory...</option>
                ${subcategories.map(s => `<option value="${s.subcategoryId}">${s.subcategoryName}</option>`).join('')}</select></div>
                <div class="form-group"><label>Service Name *</label><input type="text" id="serviceName" required></div>
                <div class="form-group"><label>Short Description</label><textarea id="shortDescription"></textarea></div>
                <div class="form-group"><label>Full Description</label><textarea id="fullDescription"></textarea></div>
                <div class="form-group"><label>Service Mode</label><input type="text" id="serviceMode"></div>
                <div class="form-group"><label>Age Group</label><input type="text" id="ageGroup"></div>
                <div class="form-group"><label>Price Info</label><input type="text" id="priceInfo"></div>
                <div class="form-group"><label>Area Served</label><input type="text" id="areaServed"></div>
                <div class="form-actions"><button class="btn btn-success" onclick="saveService()">Save</button>
                <button class="btn btn-secondary" onclick="cancelForm('${tab}')">Cancel</button></div>`;
        });
    } else if (tab === 'recommendations') {
        Promise.all([loadServicesForForm(), loadCommunitiesForForm()]).then(([services, communities]) => {
            formContainer.innerHTML = `<h3>Add New Recommendation</h3>
                <div class="form-group"><label>Service *</label><select id="serviceId" required><option value="">Select service...</option>
                ${services.map(s => `<option value="${s.serviceId}">${s.serviceName}</option>`).join('')}</select></div>
                <div class="form-group"><label>Community *</label><select id="communityId" required><option value="">Select community...</option>
                ${communities.map(c => `<option value="${c.communityId}">${c.communityName}</option>`).join('')}</select></div>
                <div class="form-group"><label>Recommender Name</label><input type="text" id="recommenderName"></div>
                <div class="form-group"><label>Recommender Note</label><textarea id="recommenderNote"></textarea></div>
                <div class="form-group"><label>Status</label><select id="status"><option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option><option value="REJECTED">Rejected</option></select></div>
                <div class="form-actions"><button class="btn btn-success" onclick="saveRecommendation()">Save</button>
                <button class="btn btn-secondary" onclick="cancelForm('${tab}')">Cancel</button></div>`;
        });
    } else if (tab === 'community-services') {
        const communityId = document.getElementById('community-services-select').value;
        if (!communityId) {
            alert('Please select a community first!');
            return;
        }
        loadServicesForForm().then(services => {
            formContainer.innerHTML = `<h3>Add Service to Community</h3>
                <div class="form-group"><label>Service *</label><select id="serviceId" required><option value="">Select service...</option>
                ${services.map(s => `<option value="${s.serviceId}">${s.serviceName} (${s.providerName || 'N/A'})</option>`).join('')}</select></div>
                <div class="form-group"><label>Featured</label><input type="checkbox" id="isFeatured"></div>
                <div class="form-group"><label>Display Order</label><input type="number" id="displayOrder" value="0"></div>
                <div class="form-group"><label>Added By</label><input type="text" id="addedBy" placeholder="Your name"></div>
                <div class="form-actions"><button class="btn btn-success" onclick="saveCommunityService()">Save</button>
                <button class="btn btn-secondary" onclick="cancelForm('${tab}')">Cancel</button></div>`;
        });
    }
    formContainer.classList.add('active');
}

async function saveCommunity() {
    const data = {
        communityName: document.getElementById('communityName').value,
        city: document.getElementById('city').value,
        area: document.getElementById('area').value,
        description: document.getElementById('description').value
    };
    try {
        const url = currentEditId ? `${API_BASE}/communities/${currentEditId}` : `${API_BASE}/communities`;
        const method = currentEditId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('communities', `Community ${currentEditId ? 'updated' : 'created'} successfully!`);
            cancelForm('communities');
            await loadCommunitiesDropdown();
            if (currentEditId) loadCommunityDetails();
        } else {
            showMessage('communities', 'Error saving community', 'error');
        }
    } catch (error) {
        showMessage('communities', 'Error saving community', 'error');
    }
}

async function editCommunityInline(id) {
    currentEditId = id;
    try {
        const response = await fetch(`${API_BASE}/communities/${id}`);
        const community = await response.json();
        const row = document.getElementById(`community-row-${id}`);
        row.innerHTML = `
            <td>${community.communityId}</td>
            <td><input type="text" id="edit-communityName-${id}" value="${community.communityName}" class="form-control-sm"></td>
            <td><input type="text" id="edit-city-${id}" value="${community.city}" class="form-control-sm"></td>
            <td><input type="text" id="edit-area-${id}" value="${community.area || ''}" class="form-control-sm"></td>
            <td><textarea id="edit-description-${id}" class="form-control-sm">${community.description || ''}</textarea></td>
            <td>${community.isActive ? '✅' : '❌'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-success" onclick="saveCommunityInline(${id})">Save</button>
                <button class="btn btn-sm btn-secondary" onclick="cancelEditInline('communities', ${id})">Cancel</button>
            </td>`;
    } catch (error) {
        showMessage('communities', 'Error loading community', 'error');
    }
}

async function saveCommunityInline(id) {
    const data = {
        communityName: document.getElementById(`edit-communityName-${id}`).value,
        city: document.getElementById(`edit-city-${id}`).value,
        area: document.getElementById(`edit-area-${id}`).value,
        description: document.getElementById(`edit-description-${id}`).value
    };
    try {
        const response = await fetch(`${API_BASE}/communities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('communities', 'Community updated successfully!');
            currentEditId = null;
            loadCommunityDetails();
        } else {
            showMessage('communities', 'Error updating community', 'error');
        }
    } catch (error) {
        showMessage('communities', 'Error updating community', 'error');
    }
}

async function cancelEditInline(tab, id) {
    currentEditId = null;
    if (tab === 'communities') loadCommunityDetails();
    else if (tab === 'categories') loadCategoryDetails();
    else if (tab === 'subcategories') loadSubcategoryDetails();
    else if (tab === 'providers') loadProviderDetails();
    else if (tab === 'services') loadServiceDetails();
    else if (tab === 'recommendations') loadRecommendationDetails();
    else if (tab === 'community-services') loadCommunityServiceDetails();
}

async function deleteCommunity(id) {
    if (!confirm('Are you sure you want to delete this community?')) return;
    try {
        const response = await fetch(`${API_BASE}/communities/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('communities', 'Community deleted successfully!');
            await loadCommunitiesDropdown();
            document.getElementById('communities-table').innerHTML = '';
            document.getElementById('communities-select').value = '';
        } else {
            showMessage('communities', 'Error deleting community', 'error');
        }
    } catch (error) {
        showMessage('communities', 'Error deleting community', 'error');
    }
}

// CATEGORIES
async function loadCategoriesDropdown() {
    console.log('Loading all categories...');
    try {
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const categories = await response.json();
        console.log('Categories loaded:', categories.length);
        
        // Display ALL categories in table by default
        displayCategoryTable(categories);
        
        // Populate type dropdown
        const types = [...new Set(categories.map(c => c.categoryType).filter(Boolean))].sort();
        
        const typeSelect = document.getElementById('categories-filter-type');
        typeSelect.innerHTML = '<option value="all">All</option>';
        types.forEach(type => {
            typeSelect.innerHTML += `<option value="${type}">${type}</option>`;
        });
        
        // Store all categories for client-side filtering
        window.allCategories = categories;
    } catch (error) {
        console.error('Error loading categories:', error);
        showMessage('categories', 'Error loading categories: ' + error.message, 'error');
    }
}

async function filterCategories() {
    const status = document.getElementById('categories-filter-status').value;
    const type = document.getElementById('categories-filter-type').value;
    
    if (!window.allCategories) {
        await loadCategoriesDropdown();
        return;
    }
    
    // Start with all categories
    let filtered = [...window.allCategories];
    
    // Apply status filter
    if (status === 'active') {
        filtered = filtered.filter(c => c.isActive === true);
    }
    
    // Apply type filter
    if (type !== 'all') {
        filtered = filtered.filter(c => c.categoryType === type);
    }
    
    displayCategoryTable(filtered);
}

async function loadCategoryDetails() {
    // This function is no longer needed but kept for compatibility
    filterCategories();
}

function displayCategoryTable(categories) {
    const container = document.getElementById('categories-table');
    if (categories.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No categories found</h3></div>';
        return;
    }
    let html = '<table><thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Description</th><th>Active</th><th>Actions</th></tr></thead><tbody>';
    categories.forEach(c => {
        html += `<tr id="category-row-${c.categoryId}">
            <td>${c.categoryId}</td>
            <td>${c.categoryName}</td>
            <td>${c.categoryType || 'N/A'}</td>
            <td>${c.description || 'N/A'}</td>
            <td>${c.isActive ? '✅' : '❌'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-primary" onclick="editCategoryInline(${c.categoryId})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCategory(${c.categoryId})">Delete</button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

async function saveCategory() {
    const data = {
        categoryName: document.getElementById('categoryName').value,
        categoryType: document.getElementById('categoryType').value,
        description: document.getElementById('description').value
    };
    try {
        const url = currentEditId ? `${API_BASE}/categories/${currentEditId}` : `${API_BASE}/categories`;
        const method = currentEditId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('categories', `Category ${currentEditId ? 'updated' : 'created'} successfully!`);
            cancelForm('categories');
            await loadCategoriesDropdown();
            if (currentEditId) loadCategoryDetails();
        } else {
            showMessage('categories', 'Error saving category', 'error');
        }
    } catch (error) {
        showMessage('categories', 'Error saving category', 'error');
    }
}

async function editCategoryInline(id) {
    currentEditId = id;
    try {
        const response = await fetch(`${API_BASE}/categories/${id}`);
        const category = await response.json();
        const row = document.getElementById(`category-row-${id}`);
        row.innerHTML = `
            <td>${category.categoryId}</td>
            <td><input type="text" id="edit-categoryName-${id}" value="${category.categoryName}" class="form-control-sm"></td>
            <td><input type="text" id="edit-categoryType-${id}" value="${category.categoryType || ''}" class="form-control-sm"></td>
            <td><textarea id="edit-description-${id}" class="form-control-sm">${category.description || ''}</textarea></td>
            <td>${category.isActive ? '✅' : '❌'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-success" onclick="saveCategoryInline(${id})">Save</button>
                <button class="btn btn-sm btn-secondary" onclick="cancelEditInline('categories', ${id})">Cancel</button>
            </td>`;
    } catch (error) {
        showMessage('categories', 'Error loading category', 'error');
    }
}

async function saveCategoryInline(id) {
    const data = {
        categoryName: document.getElementById(`edit-categoryName-${id}`).value,
        categoryType: document.getElementById(`edit-categoryType-${id}`).value,
        description: document.getElementById(`edit-description-${id}`).value
    };
    try {
        const response = await fetch(`${API_BASE}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('categories', 'Category updated successfully!');
            currentEditId = null;
            await loadCategoriesDropdown();
            filterCategories();
        } else {
            showMessage('categories', 'Error updating category', 'error');
        }
    } catch (error) {
        showMessage('categories', 'Error updating category', 'error');
    }
}

async function editCategory(id) {
    currentEditId = id;
    try {
        const response = await fetch(`${API_BASE}/categories/${id}`);
        const category = await response.json();
        const formContainer = document.getElementById('categories-form');
        formContainer.innerHTML = `<h3>Edit Category</h3>
            <div class="form-group"><label>Category Name *</label><input type="text" id="categoryName" value="${category.categoryName}" required></div>
            <div class="form-group"><label>Category Type</label><input type="text" id="categoryType" value="${category.categoryType || ''}"></div>
            <div class="form-group"><label>Description</label><textarea id="description">${category.description || ''}</textarea></div>
            <div class="form-actions"><button class="btn btn-success" onclick="saveCategory()">Update</button>
            <button class="btn btn-secondary" onclick="cancelForm('categories')">Cancel</button></div>`;
        formContainer.classList.add('active');
    } catch (error) {
        showMessage('categories', 'Error loading category', 'error');
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
        const response = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('categories', 'Category deleted successfully!');
            await loadCategoriesDropdown();
            filterCategories();
        } else {
            showMessage('categories', 'Error deleting category', 'error');
        }
    } catch (error) {
        showMessage('categories', 'Error deleting category', 'error');
    }
}

// SUBCATEGORIES
async function loadSubcategoriesDropdown() {
    console.log('Loading all subcategories...');
    try {
        const [subcategoriesRes, categoriesRes] = await Promise.all([
            fetch(`${API_BASE}/subcategories`),
            fetch(`${API_BASE}/categories`)
        ]);
        if (!subcategoriesRes.ok) throw new Error(`HTTP error! status: ${subcategoriesRes.status}`);
        
        const subcategories = await subcategoriesRes.json();
        const categories = await categoriesRes.json();
        console.log('Subcategories loaded:', subcategories.length);
        
        // Display ALL subcategories in table by default
        displaySubcategoryTable(subcategories);
        
        // Populate category dropdown
        const categorySelect = document.getElementById('subcategories-filter-category');
        categorySelect.innerHTML = '<option value="all">All</option>';
        categories.forEach(cat => {
            categorySelect.innerHTML += `<option value="${cat.categoryId}">${cat.categoryName}</option>`;
        });
        
        // Store all subcategories for client-side filtering
        window.allSubcategories = subcategories;
    } catch (error) {
        console.error('Error loading subcategories:', error);
        showMessage('subcategories', 'Error loading subcategories: ' + error.message, 'error');
    }
}

async function filterSubcategories() {
    const status = document.getElementById('subcategories-filter-status').value;
    const categoryId = document.getElementById('subcategories-filter-category').value;
    
    if (!window.allSubcategories) {
        await loadSubcategoriesDropdown();
        return;
    }
    
    // Start with all subcategories
    let filtered = [...window.allSubcategories];
    
    // Apply status filter
    if (status === 'active') {
        filtered = filtered.filter(s => s.isActive === true);
    }
    
    // Apply category filter
    if (categoryId !== 'all') {
        filtered = filtered.filter(s => s.categoryId === parseInt(categoryId));
    }
    
    displaySubcategoryTable(filtered);
}

async function loadSubcategoryDetails() {
    // This function is no longer needed but kept for compatibility
    filterSubcategories();
}

function displaySubcategoryTable(subcategories) {
    const container = document.getElementById('subcategories-table');
    if (subcategories.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No subcategories found</h3></div>';
        return;
    }
    let html = '<table><thead><tr><th>ID</th><th>Name</th><th>Category ID</th><th>Description</th><th>Active</th><th>Actions</th></tr></thead><tbody>';
    subcategories.forEach(s => {
        html += `<tr id="subcategory-row-${s.subcategoryId}">
            <td>${s.subcategoryId}</td>
            <td>${s.subcategoryName}</td>
            <td>${s.categoryId}</td>
            <td>${s.description || 'N/A'}</td>
            <td>${s.isActive ? '✅' : '❌'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-primary" onclick="editSubcategoryInline(${s.subcategoryId})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSubcategory(${s.subcategoryId})">Delete</button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

async function saveSubcategory() {
    const data = {
        categoryId: parseInt(document.getElementById('categoryId').value),
        subcategoryName: document.getElementById('subcategoryName').value,
        description: document.getElementById('description').value
    };
    try {
        const url = currentEditId ? `${API_BASE}/subcategories/${currentEditId}` : `${API_BASE}/subcategories`;
        const method = currentEditId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('subcategories', `Subcategory ${currentEditId ? 'updated' : 'created'} successfully!`);
            cancelForm('subcategories');
            await loadSubcategoriesDropdown();
            if (currentEditId) loadSubcategoryDetails();
        } else {
            showMessage('subcategories', 'Error saving subcategory', 'error');
        }
    } catch (error) {
        showMessage('subcategories', 'Error saving subcategory', 'error');
    }
}

async function editSubcategoryInline(id) {
    currentEditId = id;
    try {
        const [subcategoryRes, categoriesRes] = await Promise.all([
            fetch(`${API_BASE}/subcategories/${id}`),
            fetch(`${API_BASE}/categories`)
        ]);
        const subcategory = await subcategoryRes.json();
        const categories = await categoriesRes.json();
        const row = document.getElementById(`subcategory-row-${id}`);
        row.innerHTML = `
            <td>${subcategory.subcategoryId}</td>
            <td><input type="text" id="edit-subcategoryName-${id}" value="${subcategory.subcategoryName}" class="form-control-sm"></td>
            <td><select id="edit-categoryId-${id}" class="form-control-sm">
                ${categories.map(c => `<option value="${c.categoryId}" ${c.categoryId === subcategory.categoryId ? 'selected' : ''}>${c.categoryName}</option>`).join('')}
            </select></td>
            <td><textarea id="edit-description-${id}" class="form-control-sm">${subcategory.description || ''}</textarea></td>
            <td>${subcategory.isActive ? '✅' : '❌'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-success" onclick="saveSubcategoryInline(${id})">Save</button>
                <button class="btn btn-sm btn-secondary" onclick="cancelEditInline('subcategories', ${id})">Cancel</button>
            </td>`;
    } catch (error) {
        showMessage('subcategories', 'Error loading subcategory', 'error');
    }
}

async function saveSubcategoryInline(id) {
    const data = {
        categoryId: document.getElementById(`edit-categoryId-${id}`).value,
        subcategoryName: document.getElementById(`edit-subcategoryName-${id}`).value,
        description: document.getElementById(`edit-description-${id}`).value
    };
    try {
        const response = await fetch(`${API_BASE}/subcategories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('subcategories', 'Subcategory updated successfully!');
            currentEditId = null;
            await loadSubcategoriesDropdown();
            filterSubcategories();
        } else {
            showMessage('subcategories', 'Error updating subcategory', 'error');
        }
    } catch (error) {
        showMessage('subcategories', 'Error updating subcategory', 'error');
    }
}

async function editSubcategory(id) {
    currentEditId = id;
    try {
        const [subcategoryRes, categoriesRes] = await Promise.all([
            fetch(`${API_BASE}/subcategories/${id}`),
            fetch(`${API_BASE}/categories`)
        ]);
        const subcategory = await subcategoryRes.json();
        const categories = await categoriesRes.json();
        const formContainer = document.getElementById('subcategories-form');
        formContainer.innerHTML = `<h3>Edit Subcategory</h3>
            <div class="form-group"><label>Category *</label><select id="categoryId" required>
            ${categories.map(c => `<option value="${c.categoryId}" ${c.categoryId === subcategory.categoryId ? 'selected' : ''}>${c.categoryName}</option>`).join('')}</select></div>
            <div class="form-group"><label>Subcategory Name *</label><input type="text" id="subcategoryName" value="${subcategory.subcategoryName}" required></div>
            <div class="form-group"><label>Description</label><textarea id="description">${subcategory.description || ''}</textarea></div>
            <div class="form-actions"><button class="btn btn-success" onclick="saveSubcategory()">Update</button>
            <button class="btn btn-secondary" onclick="cancelForm('subcategories')">Cancel</button></div>`;
        formContainer.classList.add('active');
    } catch (error) {
        showMessage('subcategories', 'Error loading subcategory', 'error');
    }
}

async function deleteSubcategory(id) {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    try {
        const response = await fetch(`${API_BASE}/subcategories/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('subcategories', 'Subcategory deleted successfully!');
            await loadSubcategoriesDropdown();
            filterSubcategories();
        } else {
            showMessage('subcategories', 'Error deleting subcategory', 'error');
        }
    } catch (error) {
        showMessage('subcategories', 'Error deleting subcategory', 'error');
    }
}

// PROVIDERS
async function loadProvidersDropdown() {
    console.log('Loading all providers...');
    try {
        const response = await fetch(`${API_BASE}/providers`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const providers = await response.json();
        console.log('Providers loaded:', providers.length);
        
        // Display ALL providers in table by default
        displayProviderTable(providers);
        
        // Populate city and area dropdowns
        const cities = [...new Set(providers.map(p => p.city).filter(Boolean))].sort();
        const areas = [...new Set(providers.map(p => p.area).filter(Boolean))].sort();
        
        const citySelect = document.getElementById('providers-filter-city');
        const areaSelect = document.getElementById('providers-filter-area');
        
        citySelect.innerHTML = '<option value="all">All</option>';
        cities.forEach(city => {
            citySelect.innerHTML += `<option value="${city}">${city}</option>`;
        });
        
        areaSelect.innerHTML = '<option value="all">All</option>';
        areas.forEach(area => {
            areaSelect.innerHTML += `<option value="${area}">${area}</option>`;
        });
        
        // Store all providers for client-side filtering
        window.allProviders = providers;
    } catch (error) {
        console.error('Error loading providers:', error);
        showMessage('providers', 'Error loading providers: ' + error.message, 'error');
    }
}

async function filterProviders() {
    const status = document.getElementById('providers-filter-status').value;
    const city = document.getElementById('providers-filter-city').value;
    const area = document.getElementById('providers-filter-area').value;
    
    if (!window.allProviders) {
        await loadProvidersDropdown();
        return;
    }
    
    // Start with all providers
    let filtered = [...window.allProviders];
    
    // Apply status filter
    if (status === 'active') {
        filtered = filtered.filter(p => p.isActive === true);
    }
    
    // Apply city filter
    if (city !== 'all') {
        filtered = filtered.filter(p => p.city === city);
    }
    
    // Apply area filter
    if (area !== 'all') {
        filtered = filtered.filter(p => p.area === area);
    }
    
    displayProviderTable(filtered);
}

async function loadProviderDetails() {
    // This function is no longer needed but kept for compatibility
    filterProviders();
}

function displayProviderTable(providers) {
    const container = document.getElementById('providers-table');
    if (providers.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No providers found</h3></div>';
        return;
    }
    let html = '<table><thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Phone</th><th>Email</th><th>City</th><th>Active</th><th>Actions</th></tr></thead><tbody>';
    providers.forEach(p => {
        html += `<tr id="provider-row-${p.providerId}">
            <td>${p.providerId}</td>
            <td>${p.providerName}</td>
            <td>${p.contactPerson || 'N/A'}</td>
            <td>${p.phoneNumber || 'N/A'}</td>
            <td>${p.email || 'N/A'}</td>
            <td>${p.city}</td>
            <td>${p.isActive ? '✅' : '❌'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-primary" onclick="editProviderInline(${p.providerId})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProvider(${p.providerId})">Delete</button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

async function saveProvider() {
    const data = {
        providerName: document.getElementById('providerName').value,
        contactPerson: document.getElementById('contactPerson').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        email: document.getElementById('email').value,
        whatsappNumber: document.getElementById('whatsappNumber').value,
        addressLine1: document.getElementById('addressLine1').value,
        addressLine2: document.getElementById('addressLine2').value,
        city: document.getElementById('city').value,
        area: document.getElementById('area').value,
        description: document.getElementById('description').value
    };
    try {
        const url = currentEditId ? `${API_BASE}/providers/${currentEditId}` : `${API_BASE}/providers`;
        const method = currentEditId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('providers', `Provider ${currentEditId ? 'updated' : 'created'} successfully!`);
            cancelForm('providers');
            await loadProvidersDropdown();
            if (currentEditId) loadProviderDetails();
        } else {
            showMessage('providers', 'Error saving provider', 'error');
        }
    } catch (error) {
        showMessage('providers', 'Error saving provider', 'error');
    }
}

async function editProviderInline(id) {
    currentEditId = id;
    try {
        const response = await fetch(`${API_BASE}/providers/${id}`);
        const provider = await response.json();
        const row = document.getElementById(`provider-row-${id}`);
        row.innerHTML = `
            <td>${provider.providerId}</td>
            <td><input type="text" id="edit-providerName-${id}" value="${provider.providerName}" class="form-control-sm"></td>
            <td><input type="text" id="edit-contactPerson-${id}" value="${provider.contactPerson || ''}" class="form-control-sm"></td>
            <td><input type="text" id="edit-phoneNumber-${id}" value="${provider.phoneNumber || ''}" class="form-control-sm"></td>
            <td><input type="email" id="edit-email-${id}" value="${provider.email || ''}" class="form-control-sm"></td>
            <td><input type="text" id="edit-city-${id}" value="${provider.city}" class="form-control-sm"></td>
            <td>${provider.isActive ? '✅' : '❌'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-success" onclick="saveProviderInline(${id})">Save</button>
                <button class="btn btn-sm btn-secondary" onclick="cancelEditInline('providers', ${id})">Cancel</button>
            </td>`;
    } catch (error) {
        showMessage('providers', 'Error loading provider', 'error');
    }
}

async function saveProviderInline(id) {
    const data = {
        providerName: document.getElementById(`edit-providerName-${id}`).value,
        contactPerson: document.getElementById(`edit-contactPerson-${id}`).value,
        phoneNumber: document.getElementById(`edit-phoneNumber-${id}`).value,
        email: document.getElementById(`edit-email-${id}`).value,
        city: document.getElementById(`edit-city-${id}`).value
    };
    try {
        const response = await fetch(`${API_BASE}/providers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('providers', 'Provider updated successfully!');
            currentEditId = null;
            await loadProvidersDropdown();
            filterProviders();
        } else {
            showMessage('providers', 'Error updating provider', 'error');
        }
    } catch (error) {
        showMessage('providers', 'Error updating provider', 'error');
    }
}

async function editProvider(id) {
    currentEditId = id;
    try {
        const response = await fetch(`${API_BASE}/providers/${id}`);
        const provider = await response.json();
        const formContainer = document.getElementById('providers-form');
        formContainer.innerHTML = `<h3>Edit Provider</h3>
            <div class="form-group"><label>Provider Name *</label><input type="text" id="providerName" value="${provider.providerName}" required></div>
            <div class="form-group"><label>Contact Person</label><input type="text" id="contactPerson" value="${provider.contactPerson || ''}"></div>
            <div class="form-group"><label>Phone Number</label><input type="text" id="phoneNumber" value="${provider.phoneNumber || ''}"></div>
            <div class="form-group"><label>Email</label><input type="email" id="email" value="${provider.email || ''}"></div>
            <div class="form-group"><label>WhatsApp Number</label><input type="text" id="whatsappNumber" value="${provider.whatsappNumber || ''}"></div>
            <div class="form-group"><label>Address Line 1</label><input type="text" id="addressLine1" value="${provider.addressLine1 || ''}"></div>
            <div class="form-group"><label>Address Line 2</label><input type="text" id="addressLine2" value="${provider.addressLine2 || ''}"></div>
            <div class="form-group"><label>City *</label><input type="text" id="city" value="${provider.city}" required></div>
            <div class="form-group"><label>Area</label><input type="text" id="area" value="${provider.area || ''}"></div>
            <div class="form-group"><label>Description</label><textarea id="description">${provider.description || ''}</textarea></div>
            <div class="form-actions"><button class="btn btn-success" onclick="saveProvider()">Update</button>
            <button class="btn btn-secondary" onclick="cancelForm('providers')">Cancel</button></div>`;
        formContainer.classList.add('active');
    } catch (error) {
        showMessage('providers', 'Error loading provider', 'error');
    }
}

async function deleteProvider(id) {
    if (!confirm('Are you sure you want to delete this provider?')) return;
    try {
        const response = await fetch(`${API_BASE}/providers/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('providers', 'Provider deleted successfully!');
            await loadProvidersDropdown();
            filterProviders();
        } else {
            showMessage('providers', 'Error deleting provider', 'error');
        }
    } catch (error) {
        showMessage('providers', 'Error deleting provider', 'error');
    }
}

// SERVICES
async function loadServicesDropdown() {
    console.log('Loading all services...');
    try {
        const [servicesRes, providersRes, subcategoriesRes] = await Promise.all([
            fetch(`${API_BASE}/services`),
            fetch(`${API_BASE}/providers`),
            fetch(`${API_BASE}/subcategories`)
        ]);
        if (!servicesRes.ok) throw new Error(`HTTP error! status: ${servicesRes.status}`);
        
        const services = await servicesRes.json();
        const providers = await providersRes.json();
        const subcategories = await subcategoriesRes.json();
        console.log('Services loaded:', services.length);
        
        // Display ALL services in table by default
        displayServiceTable(services);
        
        // Populate provider dropdown
        const providerSelect = document.getElementById('services-filter-provider');
        providerSelect.innerHTML = '<option value="all">All</option>';
        providers.forEach(p => {
            providerSelect.innerHTML += `<option value="${p.providerId}">${p.providerName}</option>`;
        });
        
        // Populate subcategory dropdown
        const subcategorySelect = document.getElementById('services-filter-subcategory');
        subcategorySelect.innerHTML = '<option value="all">All</option>';
        subcategories.forEach(s => {
            subcategorySelect.innerHTML += `<option value="${s.subcategoryId}">${s.subcategoryName}</option>`;
        });
        
        // Store all services for client-side filtering
        window.allServices = services;
    } catch (error) {
        console.error('Error loading services:', error);
        showMessage('services', 'Error loading services: ' + error.message, 'error');
    }
}

async function filterServices() {
    const status = document.getElementById('services-filter-status').value;
    const providerId = document.getElementById('services-filter-provider').value;
    const subcategoryId = document.getElementById('services-filter-subcategory').value;
    
    if (!window.allServices) {
        await loadServicesDropdown();
        return;
    }
    
    // Start with all services
    let filtered = [...window.allServices];
    
    // Apply status filter
    if (status === 'active') {
        filtered = filtered.filter(s => s.isActive === true);
    }
    
    // Apply provider filter
    if (providerId !== 'all') {
        filtered = filtered.filter(s => s.providerId === parseInt(providerId));
    }
    
    // Apply subcategory filter
    if (subcategoryId !== 'all') {
        filtered = filtered.filter(s => s.subcategoryId === parseInt(subcategoryId));
    }
    
    displayServiceTable(filtered);
}

async function loadServiceDetails() {
    // This function is no longer needed but kept for compatibility
    filterServices();
}

function displayServiceTable(services) {
    const container = document.getElementById('services-table');
    if (services.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No services found</h3></div>';
        return;
    }
    let html = '<table><thead><tr><th>ID</th><th>Name</th><th>Provider ID</th><th>Subcategory ID</th><th>Mode</th><th>Age Group</th><th>Active</th><th>Actions</th></tr></thead><tbody>';
    services.forEach(s => {
        html += `<tr id="service-row-${s.serviceId}">
            <td>${s.serviceId}</td>
            <td>${s.serviceName}</td>
            <td>${s.providerId}</td>
            <td>${s.subcategoryId}</td>
            <td>${s.serviceMode || 'N/A'}</td>
            <td>${s.ageGroup || 'N/A'}</td>
            <td>${s.isActive ? '✅' : '❌'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-primary" onclick="editServiceInline(${s.serviceId})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteService(${s.serviceId})">Delete</button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

async function saveService() {
    const data = {
        providerId: parseInt(document.getElementById('providerId').value),
        subcategoryId: parseInt(document.getElementById('subcategoryId').value),
        serviceName: document.getElementById('serviceName').value,
        shortDescription: document.getElementById('shortDescription').value,
        fullDescription: document.getElementById('fullDescription').value,
        serviceMode: document.getElementById('serviceMode').value,
        ageGroup: document.getElementById('ageGroup').value,
        priceInfo: document.getElementById('priceInfo').value,
        areaServed: document.getElementById('areaServed').value
    };
    try {
        const url = currentEditId ? `${API_BASE}/services/${currentEditId}` : `${API_BASE}/services`;
        const method = currentEditId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('services', `Service ${currentEditId ? 'updated' : 'created'} successfully!`);
            cancelForm('services');
            await loadServicesDropdown();
            if (currentEditId) loadServiceDetails();
        } else {
            showMessage('services', 'Error saving service', 'error');
        }
    } catch (error) {
        showMessage('services', 'Error saving service', 'error');
    }
}

async function editServiceInline(id) {
    currentEditId = id;
    try {
        const [serviceRes, providersRes, subcategoriesRes] = await Promise.all([
            fetch(`${API_BASE}/services/${id}`),
            fetch(`${API_BASE}/providers`),
            fetch(`${API_BASE}/subcategories`)
        ]);
        const service = await serviceRes.json();
        const providers = await providersRes.json();
        const subcategories = await subcategoriesRes.json();
        const row = document.getElementById(`service-row-${id}`);
        row.innerHTML = `
            <td>${service.serviceId}</td>
            <td><input type="text" id="edit-serviceName-${id}" value="${service.serviceName}" class="form-control-sm"></td>
            <td><select id="edit-providerId-${id}" class="form-control-sm">
                ${providers.map(p => `<option value="${p.providerId}" ${p.providerId === service.providerId ? 'selected' : ''}>${p.providerName}</option>`).join('')}
            </select></td>
            <td><select id="edit-subcategoryId-${id}" class="form-control-sm">
                ${subcategories.map(s => `<option value="${s.subcategoryId}" ${s.subcategoryId === service.subcategoryId ? 'selected' : ''}>${s.subcategoryName}</option>`).join('')}
            </select></td>
            <td><input type="text" id="edit-serviceMode-${id}" value="${service.serviceMode || ''}" class="form-control-sm"></td>
            <td><input type="text" id="edit-ageGroup-${id}" value="${service.ageGroup || ''}" class="form-control-sm"></td>
            <td>${service.isActive ? '✅' : '❌'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-success" onclick="saveServiceInline(${id})">Save</button>
                <button class="btn btn-sm btn-secondary" onclick="cancelEditInline('services', ${id})">Cancel</button>
            </td>`;
    } catch (error) {
        showMessage('services', 'Error loading service', 'error');
    }
}

async function saveServiceInline(id) {
    const data = {
        providerId: parseInt(document.getElementById(`edit-providerId-${id}`).value),
        subcategoryId: parseInt(document.getElementById(`edit-subcategoryId-${id}`).value),
        serviceName: document.getElementById(`edit-serviceName-${id}`).value,
        serviceMode: document.getElementById(`edit-serviceMode-${id}`).value,
        ageGroup: document.getElementById(`edit-ageGroup-${id}`).value
    };
    try {
        const response = await fetch(`${API_BASE}/services/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('services', 'Service updated successfully!');
            currentEditId = null;
            await loadServicesDropdown();
            filterServices();
        } else {
            showMessage('services', 'Error updating service', 'error');
        }
    } catch (error) {
        showMessage('services', 'Error updating service', 'error');
    }
}

async function editService(id) {
    currentEditId = id;
    try {
        const [serviceRes, providersRes, subcategoriesRes] = await Promise.all([
            fetch(`${API_BASE}/services/${id}`),
            fetch(`${API_BASE}/providers`),
            fetch(`${API_BASE}/subcategories`)
        ]);
        const service = await serviceRes.json();
        const providers = await providersRes.json();
        const subcategories = await subcategoriesRes.json();
        const formContainer = document.getElementById('services-form');
        formContainer.innerHTML = `<h3>Edit Service</h3>
            <div class="form-group"><label>Provider *</label><select id="providerId" required>
            ${providers.map(p => `<option value="${p.providerId}" ${p.providerId === service.providerId ? 'selected' : ''}>${p.providerName}</option>`).join('')}</select></div>
            <div class="form-group"><label>Subcategory *</label><select id="subcategoryId" required>
            ${subcategories.map(s => `<option value="${s.subcategoryId}" ${s.subcategoryId === service.subcategoryId ? 'selected' : ''}>${s.subcategoryName}</option>`).join('')}</select></div>
            <div class="form-group"><label>Service Name *</label><input type="text" id="serviceName" value="${service.serviceName}" required></div>
            <div class="form-group"><label>Short Description</label><textarea id="shortDescription">${service.shortDescription || ''}</textarea></div>
            <div class="form-group"><label>Full Description</label><textarea id="fullDescription">${service.fullDescription || ''}</textarea></div>
            <div class="form-group"><label>Service Mode</label><input type="text" id="serviceMode" value="${service.serviceMode || ''}"></div>
            <div class="form-group"><label>Age Group</label><input type="text" id="ageGroup" value="${service.ageGroup || ''}"></div>
            <div class="form-group"><label>Price Info</label><input type="text" id="priceInfo" value="${service.priceInfo || ''}"></div>
            <div class="form-group"><label>Area Served</label><input type="text" id="areaServed" value="${service.areaServed || ''}"></div>
            <div class="form-actions"><button class="btn btn-success" onclick="saveService()">Update</button>
            <button class="btn btn-secondary" onclick="cancelForm('services')">Cancel</button></div>`;
        formContainer.classList.add('active');
    } catch (error) {
        showMessage('services', 'Error loading service', 'error');
    }
}

async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
        const response = await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('services', 'Service deleted successfully!');
            await loadServicesDropdown();
            filterServices();
        } else {
            showMessage('services', 'Error deleting service', 'error');
        }
    } catch (error) {
        showMessage('services', 'Error deleting service', 'error');
    }
}

// RECOMMENDATIONS
async function loadRecommendationsDropdown() {
    console.log('Loading all recommendations...');
    try {
        const [recommendationsRes, communitiesRes, servicesRes] = await Promise.all([
            fetch(`${API_BASE}/recommendations`),
            fetch(`${API_BASE}/communities`),
            fetch(`${API_BASE}/services`)
        ]);
        if (!recommendationsRes.ok) throw new Error(`HTTP error! status: ${recommendationsRes.status}`);
        
        const recommendations = await recommendationsRes.json();
        const communities = await communitiesRes.json();
        const services = await servicesRes.json();
        console.log('Recommendations loaded:', recommendations.length);
        
        // Display ALL recommendations in table by default
        displayRecommendationTable(recommendations);
        
        // Populate community dropdown
        const communitySelect = document.getElementById('recommendations-filter-community');
        communitySelect.innerHTML = '<option value="all">All</option>';
        communities.forEach(c => {
            communitySelect.innerHTML += `<option value="${c.communityId}">${c.communityName}</option>`;
        });
        
        // Populate service dropdown
        const serviceSelect = document.getElementById('recommendations-filter-service');
        serviceSelect.innerHTML = '<option value="all">All</option>';
        services.forEach(s => {
            serviceSelect.innerHTML += `<option value="${s.serviceId}">${s.serviceName}</option>`;
        });
        
        // Store all recommendations for client-side filtering
        window.allRecommendations = recommendations;
    } catch (error) {
        console.error('Error loading recommendations:', error);
        showMessage('recommendations', 'Error loading recommendations: ' + error.message, 'error');
    }
}

async function filterRecommendations() {
    const communityId = document.getElementById('recommendations-filter-community').value;
    const serviceId = document.getElementById('recommendations-filter-service').value;
    const status = document.getElementById('recommendations-filter-status').value;
    
    if (!window.allRecommendations) {
        await loadRecommendationsDropdown();
        return;
    }
    
    // Start with all recommendations
    let filtered = [...window.allRecommendations];
    
    // Apply community filter
    if (communityId !== 'all') {
        filtered = filtered.filter(r => r.communityId === parseInt(communityId));
    }
    
    // Apply service filter
    if (serviceId !== 'all') {
        filtered = filtered.filter(r => r.serviceId === parseInt(serviceId));
    }
    
    // Apply status filter
    if (status !== 'all') {
        filtered = filtered.filter(r => r.status === status);
    }
    
    displayRecommendationTable(filtered);
}

async function loadRecommendationDetails() {
    // This function is no longer needed but kept for compatibility
    filterRecommendations();
}

function displayRecommendationTable(recommendations) {
    const container = document.getElementById('recommendations-table');
    if (recommendations.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No recommendations found</h3></div>';
        return;
    }
    let html = '<table><thead><tr><th>ID</th><th>Service ID</th><th>Community ID</th><th>Recommender</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    recommendations.forEach(r => {
        html += `<tr id="recommendation-row-${r.recommendationId}">
            <td>${r.recommendationId}</td>
            <td>${r.serviceId}</td>
            <td>${r.communityId}</td>
            <td>${r.recommenderName || 'N/A'}</td>
            <td>${r.status}</td>
            <td class="actions">
                <button class="btn btn-sm btn-primary" onclick="editRecommendationInline(${r.recommendationId})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRecommendation(${r.recommendationId})">Delete</button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

async function saveRecommendation() {
    const data = {
        serviceId: parseInt(document.getElementById('serviceId').value),
        communityId: parseInt(document.getElementById('communityId').value),
        recommenderName: document.getElementById('recommenderName').value,
        recommenderNote: document.getElementById('recommenderNote').value,
        status: document.getElementById('status').value
    };
    try {
        const url = currentEditId ? `${API_BASE}/recommendations/${currentEditId}` : `${API_BASE}/recommendations`;
        const method = currentEditId ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('recommendations', `Recommendation ${currentEditId ? 'updated' : 'created'} successfully!`);
            cancelForm('recommendations');
            await loadRecommendationsDropdown();
            if (currentEditId) loadRecommendationDetails();
        } else {
            showMessage('recommendations', 'Error saving recommendation', 'error');
        }
    } catch (error) {
        showMessage('recommendations', 'Error saving recommendation', 'error');
    }
}

async function editRecommendationInline(id) {
    currentEditId = id;
    try {
        const [recommendationRes, servicesRes, communitiesRes] = await Promise.all([
            fetch(`${API_BASE}/recommendations/${id}`),
            fetch(`${API_BASE}/services`),
            fetch(`${API_BASE}/communities`)
        ]);
        const recommendation = await recommendationRes.json();
        const services = await servicesRes.json();
        const communities = await communitiesRes.json();
        const row = document.getElementById(`recommendation-row-${id}`);
        row.innerHTML = `
            <td>${recommendation.recommendationId}</td>
            <td><select id="edit-serviceId-${id}" class="form-control-sm">
                ${services.map(s => `<option value="${s.serviceId}" ${s.serviceId === recommendation.serviceId ? 'selected' : ''}>${s.serviceName}</option>`).join('')}
            </select></td>
            <td><select id="edit-communityId-${id}" class="form-control-sm">
                ${communities.map(c => `<option value="${c.communityId}" ${c.communityId === recommendation.communityId ? 'selected' : ''}>${c.communityName}</option>`).join('')}
            </select></td>
            <td><input type="text" id="edit-recommenderName-${id}" value="${recommendation.recommenderName || ''}" class="form-control-sm"></td>
            <td><select id="edit-status-${id}" class="form-control-sm">
                <option value="APPROVED" ${recommendation.status === 'APPROVED' ? 'selected' : ''}>Approved</option>
                <option value="PENDING" ${recommendation.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                <option value="REJECTED" ${recommendation.status === 'REJECTED' ? 'selected' : ''}>Rejected</option>
            </select></td>
            <td class="actions">
                <button class="btn btn-sm btn-success" onclick="saveRecommendationInline(${id})">Save</button>
                <button class="btn btn-sm btn-secondary" onclick="cancelEditInline('recommendations', ${id})">Cancel</button>
            </td>`;
    } catch (error) {
        showMessage('recommendations', 'Error loading recommendation', 'error');
    }
}

async function saveRecommendationInline(id) {
    const data = {
        serviceId: parseInt(document.getElementById(`edit-serviceId-${id}`).value),
        communityId: parseInt(document.getElementById(`edit-communityId-${id}`).value),
        recommenderName: document.getElementById(`edit-recommenderName-${id}`).value,
        status: document.getElementById(`edit-status-${id}`).value
    };
    try {
        const response = await fetch(`${API_BASE}/recommendations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('recommendations', 'Recommendation updated successfully!');
            currentEditId = null;
            await loadRecommendationsDropdown();
            filterRecommendations();
        } else {
            showMessage('recommendations', 'Error updating recommendation', 'error');
        }
    } catch (error) {
        showMessage('recommendations', 'Error updating recommendation', 'error');
    }
}

async function editRecommendation(id) {
    currentEditId = id;
    try {
        const [recommendationRes, servicesRes, communitiesRes] = await Promise.all([
            fetch(`${API_BASE}/recommendations/${id}`),
            fetch(`${API_BASE}/services`),
            fetch(`${API_BASE}/communities`)
        ]);
        const recommendation = await recommendationRes.json();
        const services = await servicesRes.json();
        const communities = await communitiesRes.json();
        const formContainer = document.getElementById('recommendations-form');
        formContainer.innerHTML = `<h3>Edit Recommendation</h3>
            <div class="form-group"><label>Service *</label><select id="serviceId" required>
            ${services.map(s => `<option value="${s.serviceId}" ${s.serviceId === recommendation.serviceId ? 'selected' : ''}>${s.serviceName}</option>`).join('')}</select></div>
            <div class="form-group"><label>Community *</label><select id="communityId" required>
            ${communities.map(c => `<option value="${c.communityId}" ${c.communityId === recommendation.communityId ? 'selected' : ''}>${c.communityName}</option>`).join('')}</select></div>
            <div class="form-group"><label>Recommender Name</label><input type="text" id="recommenderName" value="${recommendation.recommenderName || ''}"></div>
            <div class="form-group"><label>Recommender Note</label><textarea id="recommenderNote">${recommendation.recommenderNote || ''}</textarea></div>
            <div class="form-group"><label>Status</label><select id="status">
            <option value="APPROVED" ${recommendation.status === 'APPROVED' ? 'selected' : ''}>Approved</option>
            <option value="PENDING" ${recommendation.status === 'PENDING' ? 'selected' : ''}>Pending</option>
            <option value="REJECTED" ${recommendation.status === 'REJECTED' ? 'selected' : ''}>Rejected</option></select></div>
            <div class="form-actions"><button class="btn btn-success" onclick="saveRecommendation()">Update</button>
            <button class="btn btn-secondary" onclick="cancelForm('recommendations')">Cancel</button></div>`;
        formContainer.classList.add('active');
    } catch (error) {
        showMessage('recommendations', 'Error loading recommendation', 'error');
    }
}

async function deleteRecommendation(id) {
    if (!confirm('Are you sure you want to delete this recommendation?')) return;
    try {
        const response = await fetch(`${API_BASE}/recommendations/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showMessage('recommendations', 'Recommendation deleted successfully!');
            await loadRecommendationsDropdown();
            filterRecommendations();
        } else {
            showMessage('recommendations', 'Error deleting recommendation', 'error');
        }
    } catch (error) {
        showMessage('recommendations', 'Error deleting recommendation', 'error');
    }
}

// Made with Bob


// COMMUNITY SERVICES
async function loadCommunityServicesDropdown() {
    console.log('Loading communities for community services dropdown...');
    try {
        const response = await fetch(`${API_BASE}/communities`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const communities = await response.json();
        console.log('Communities loaded:', communities.length);
        const select = document.getElementById('community-services-select');
        select.innerHTML = '<option value="">Select a community...</option>';
        if (communities.length === 0) {
            select.innerHTML += '<option value="" disabled>No communities found</option>';
        } else {
            communities.forEach(c => {
                select.innerHTML += `<option value="${c.communityId}">${c.communityName} - ${c.city}</option>`;
            });
        }
    } catch (error) {
        console.error('Error loading communities:', error);
        showMessage('community-services', 'Error loading communities: ' + error.message, 'error');
    }
}

async function loadCommunityServiceDetails() {
    const communityId = document.getElementById('community-services-select').value;
    if (!communityId) {
        document.getElementById('community-services-table').innerHTML = '';
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/communities/${communityId}/services`);
        const data = await response.json();
        displayCommunityServiceTable(data.services || []);
    } catch (error) {
        console.error('Error:', error);
        showMessage('community-services', 'Error loading community services', 'error');
    }
}

function displayCommunityServiceTable(services) {
    const container = document.getElementById('community-services-table');
    if (services.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No services found for this community</h3></div>';
        return;
    }
    let html = '<table><thead><tr><th>Service ID</th><th>Service Name</th><th>Provider</th><th>Category</th><th>Subcategory</th><th>Featured</th><th>Actions</th></tr></thead><tbody>';
    services.forEach(s => {
        html += `<tr id="community-service-row-${s.serviceId}">
            <td>${s.serviceId}</td>
            <td>${s.serviceName}</td>
            <td>${s.providerName || 'N/A'}</td>
            <td>${s.categoryName || 'N/A'}</td>
            <td>${s.subcategoryName || 'N/A'}</td>
            <td>${s.isFeatured ? '⭐' : '-'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-danger" onclick="removeCommunityService(${s.serviceId})">Remove</button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

async function removeCommunityService(serviceId) {
    const communityId = document.getElementById('community-services-select').value;
    if (!confirm('Are you sure you want to remove this service from the community?')) return;
    try {
        const response = await fetch(`${API_BASE}/communities/${communityId}/services/${serviceId}`, { 
            method: 'DELETE' 
        });
        if (response.ok) {
            showMessage('community-services', 'Service removed from community successfully!');
            loadCommunityServiceDetails();
        } else {
            showMessage('community-services', 'Error removing service', 'error');
        }
    } catch (error) {
        showMessage('community-services', 'Error removing service', 'error');
    }
}

async function saveCommunityService() {
    const communityId = document.getElementById('community-services-select').value;
    const data = {
        communityId: parseInt(communityId),
        serviceId: parseInt(document.getElementById('serviceId').value),
        isFeatured: document.getElementById('isFeatured').checked,
        displayOrder: parseInt(document.getElementById('displayOrder').value) || 0,
        addedBy: document.getElementById('addedBy').value
    };
    try {
        const response = await fetch(`${API_BASE}/community-services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            showMessage('community-services', 'Service added to community successfully!');
            cancelForm('community-services');
            loadCommunityServiceDetails();
        } else {
            const error = await response.text();
            showMessage('community-services', 'Error adding service: ' + error, 'error');
        }
    } catch (error) {
        showMessage('community-services', 'Error adding service', 'error');
    }
}
