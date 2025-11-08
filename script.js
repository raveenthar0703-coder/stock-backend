document.getElementById('predict-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const ticker = document.getElementById('ticker').value.toUpperCase();
    const days = document.getElementById('days').value;
    const backendUrl = `http://localhost:5000/predict?ticker=${ticker}&days=${days}`; // Replace with your backend URL
    
    try {
        const response = await fetch(backendUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // Display results
        document.getElementById('ticker-display').textContent = data.ticker;
        const tableBody = document.querySelector('#prediction-table tbody');
        tableBody.innerHTML = ''; // Clear previous rows
        
        const dates = [];
        const prices = [];
        
        data.predictions.forEach(pred => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${pred.date}</td><td>${pred.price.toFixed(2)}</td>`;
            tableBody.appendChild(row);
            
            dates.push(pred.date);
            prices.push(pred.price);
        });
        
        // Render chart
        const ctx = document.getElementById('price-chart').getContext('2d');
        if (window.priceChart) window.priceChart.destroy(); // Destroy previous chart if exists
        window.priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Predicted Price',
                    data: prices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: false }
                }
            }
        });
        
        document.getElementById('results').style.display = 'block';
    } catch (error) {
        alert('Error fetching predictions: ' + error.message);
    }
});