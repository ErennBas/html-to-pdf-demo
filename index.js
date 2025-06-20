const express = require("express");
const htmlPdfNode = require("html-pdf-node");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const invoiceData = {
	invoiceNumber: "INV-2024-001",
	date: new Date().toLocaleDateString("tr-TR"),
	customer: {
		name: "Ahmet Yılmaz",
		address: "Atatürk Caddesi No:123, İstanbul",
		phone: "+90 212 555 0123",
	},
	items: [
		{ name: "Web Tasarım Hizmeti", quantity: 1, price: 5000, total: 5000 },
		{ name: "SEO Optimizasyonu", quantity: 1, price: 2000, total: 2000 },
		{ name: "Hosting (Aylık)", quantity: 12, price: 100, total: 1200 },
	],
	subtotal: 8200,
	tax: 1476,
	total: 9676,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send(generateInvoiceHTML(invoiceData));
});

app.get("/generate-pdf", async (req, res) => {
	try {
		const htmlContent = generateInvoiceHTML(invoiceData, true);

		const options = {
			format: "A4",
			margin: {
				top: "20px",
				right: "20px",
				bottom: "20px",
				left: "20px",
			},
			printBackground: true,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--disable-gpu",
				"--no-first-run",
				"--no-zygote",
				"--single-process",
				"--disable-extensions",
			],
		};

		const file = { content: htmlContent };

		const pdfBuffer = await Promise.race([
			htmlPdfNode.generatePdf(file, options),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error("PDF oluşturma zaman aşımı")), 30000)
			),
		]);

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="fatura-${invoiceData.invoiceNumber}.pdf"`
		);
		res.send(pdfBuffer);
	} catch (error) {
		console.error("PDF oluşturma hatası:", error);
		res.status(500).json({
			error: "PDF oluşturulamadı",
			details: error.message,
		});
	}
});

function generateInvoiceHTML(data, isPdf = false) {
	return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fatura - ${data.invoiceNumber}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .invoice-title {
                font-size: 28px;
                color: #333;
                margin: 0;
            }
            .invoice-number {
                font-size: 18px;
                color: #666;
                margin: 10px 0;
            }
            .invoice-date {
                font-size: 16px;
                color: #666;
            }
            .customer-info {
                margin-bottom: 30px;
            }
            .customer-info h3 {
                color: #333;
                margin-bottom: 10px;
            }
            .customer-details {
                background: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            .items-table th,
            .items-table td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            .items-table th {
                background-color: #f2f2f2;
                font-weight: bold;
            }
            .total-section {
                margin-top: 30px;
                text-align: right;
            }
            .total-row {
                margin: 5px 0;
                font-size: 16px;
            }
            .total-amount {
                font-size: 20px;
                font-weight: bold;
                color: #333;
                border-top: 2px solid #333;
                padding-top: 10px;
            }
            .footer {
                margin-top: 40px;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            .download-btn {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 10px;
                background-color: #4CAF50;
                color: white;
                text-align: center;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            .download-btn:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            ${
							!isPdf
								? `<a href="/generate-pdf" class="download-btn">PDF İndir</a>`
								: ""
						}
            <div class="header">
                <h1 class="invoice-title">FATURA</h1>
                <div class="invoice-number">Fatura No: ${
									data.invoiceNumber
								}</div>
                <div class="invoice-date">Tarih: ${data.date}</div>
            </div>

            <div class="customer-info">
                <h3>Müşteri Bilgileri:</h3>
                <div class="customer-details">
                    <strong>Ad Soyad:</strong> ${data.customer.name}<br>
                    <strong>Adres:</strong> ${data.customer.address}<br>
                    <strong>Telefon:</strong> ${data.customer.phone}
                </div>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th>Açıklama</th>
                        <th>Miktar</th>
                        <th>Birim Fiyat</th>
                        <th>Toplam</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items
											.map(
												(item) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price.toLocaleString("tr-TR")} ₺</td>
                            <td>${item.total.toLocaleString("tr-TR")} ₺</td>
                        </tr>
                    `
											)
											.join("")}
                </tbody>
            </table>

            <div class="total-section">
                <div class="total-row">Ara Toplam: ${data.subtotal.toLocaleString(
									"tr-TR"
								)} ₺</div>
                <div class="total-row">KDV (%18): ${data.tax.toLocaleString(
									"tr-TR"
								)} ₺</div>
                <div class="total-row total-amount">Genel Toplam: ${data.total.toLocaleString(
									"tr-TR"
								)} ₺</div>
            </div>

            <div class="footer">
                <p>Bu fatura elektronik olarak oluşturulmuştur.</p>
                <p>Teşekkür ederiz!</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

app.listen(PORT, () => {
	console.log(`Server http://localhost:${PORT} adresinde çalışıyor`);
	console.log(`Fatura görüntüleme: http://localhost:${PORT}`);
	console.log(
		`PDF indirme endpoint: GET http://localhost:${PORT}/generate-pdf`
	);
});
