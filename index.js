import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

// Puppeteer browser instance'ını global olarak tut
let browser = null;

// Browser'ı başlat
async function initBrowser() {
	try {
		browser = await puppeteer.launch({
			executablePath:
				process.env.PUPPETEER_EXECUTABLE_PATH ||
				"/usr/bin/google-chrome-stable",
			headless: "new", // Yeni headless modu
			userDataDir: "/tmp/puppeteer", // Geçici dizin
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--disable-gpu",
				"--no-first-run",
				"--no-zygote",
				"--single-process",
				"--disable-extensions",
				"--disable-background-timer-throttling",
				"--disable-backgrounding-occluded-windows",
				"--disable-renderer-backgrounding",
				"--disable-features=TranslateUI",
				"--disable-ipc-flooding-protection",
				"--memory-pressure-off",
				"--max_old_space_size=2048",
				"--disable-web-security",
				"--disable-features=VizDisplayCompositor",
				"--disable-software-rasterizer",
				"--disable-background-networking",
				"--disable-default-apps",
				"--disable-sync",
				"--disable-translate",
				"--hide-scrollbars",
				"--mute-audio",
				"--no-default-browser-check",
				"--safebrowsing-disable-auto-update",
				"--disable-client-side-phishing-detection",
				"--disable-component-update",
				"--disable-domain-reliability",
				"--disable-features=AudioServiceOutOfProcess",
				"--disable-hang-monitor",
				"--disable-prompt-on-repost",
				"--disable-xvfb", // X11 display server'ı devre dışı bırak
				"--disable-3d-apis",
				"--disable-accelerated-2d-canvas",
				"--disable-accelerated-jpeg-decoding",
				"--disable-accelerated-mjpeg-decode",
				"--disable-accelerated-video-decode",
				"--disable-accelerated-video-encode",
				"--disable-gpu-compositing",
				"--disable-gpu-rasterization",
				"--disable-gpu-sandbox",
				"--disable-software-rasterizer",
				"--disable-threaded-animation",
				"--disable-threaded-scrolling",
				"--disable-webgl",
				"--disable-webgl2",
				"--disable-webgl-image-chromium",
				"--disable-webgl-draft-extensions",
				"--disable-webgl-vendor-info",
				"--disable-webgl-errors",
				"--disable-webgl-errors-console",
				"--disable-webgl-errors-reporter",
				"--disable-webgl-errors-reporter-console",
				"--disable-webgl-errors-reporter-console-log",
				"--disable-webgl-errors-reporter-console-warn",
				"--disable-webgl-errors-reporter-console-error",
				"--disable-webgl-errors-reporter-console-info",
				"--disable-webgl-errors-reporter-console-debug",
				"--disable-webgl-errors-reporter-console-trace",
				"--disable-webgl-errors-reporter-console-assert",
				"--disable-webgl-errors-reporter-console-count",
				"--disable-webgl-errors-reporter-console-countReset",
				"--disable-webgl-errors-reporter-console-group",
				"--disable-webgl-errors-reporter-console-groupCollapsed",
				"--disable-webgl-errors-reporter-console-groupEnd",
				"--disable-webgl-errors-reporter-console-time",
				"--disable-webgl-errors-reporter-console-timeEnd",
				"--disable-webgl-errors-reporter-console-timeLog",
				"--disable-webgl-errors-reporter-console-profile",
				"--disable-webgl-errors-reporter-console-profileEnd",
				"--disable-webgl-errors-reporter-console-table",
				"--disable-webgl-errors-reporter-console-trace",
				"--disable-webgl-errors-reporter-console-warn",
				"--disable-webgl-errors-reporter-console-error",
				"--disable-webgl-errors-reporter-console-info",
				"--disable-webgl-errors-reporter-console-debug",
				"--disable-webgl-errors-reporter-console-trace",
				"--disable-webgl-errors-reporter-console-assert",
				"--disable-webgl-errors-reporter-console-count",
				"--disable-webgl-errors-reporter-console-countReset",
				"--disable-webgl-errors-reporter-console-group",
				"--disable-webgl-errors-reporter-console-groupCollapsed",
				"--disable-webgl-errors-reporter-console-groupEnd",
				"--disable-webgl-errors-reporter-console-time",
				"--disable-webgl-errors-reporter-console-timeEnd",
				"--disable-webgl-errors-reporter-console-timeLog",
				"--disable-webgl-errors-reporter-console-profile",
				"--disable-webgl-errors-reporter-console-profileEnd",
				"--disable-webgl-errors-reporter-console-table",
			],
		});
		console.log("✅ Browser başarıyla başlatıldı (Ubuntu + Bun)");
	} catch (error) {
		console.error("❌ Browser başlatılamadı:", error);
		throw error;
	}
}

// Uygulama başladığında browser'ı başlat
initBrowser();

// Uygulama kapanırken browser'ı kapat
process.on("SIGINT", async () => {
	if (browser) {
		await browser.close();
	}
	process.exit(0);
});

process.on("SIGTERM", async () => {
	if (browser) {
		await browser.close();
	}
	process.exit(0);
});

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

// Browser durumunu kontrol et
app.get("/browser-status", (req, res) => {
	res.json({
		browserRunning: browser !== null,
		browserConnected: browser ? browser.connected : false,
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		memoryUsage: process.memoryUsage(),
		platform: process.platform,
		nodeVersion: process.version,
		chromePath:
			process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
		userDataDir: "/tmp/puppeteer",
		headlessMode: "new",
		runtime: "Bun",
		os: "Ubuntu",
		environment: {
			PUPPETEER_SKIP_CHROMIUM_DOWNLOAD:
				process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD,
			CHROME_BIN: process.env.CHROME_BIN,
			CHROME_PATH: process.env.CHROME_PATH,
		},
	});
});

app.get("/", (req, res) => {
	res.send(generateInvoiceHTML(invoiceData));
});

app.get("/generate-pdf", async (req, res) => {
	try {
		// Browser'ın hazır olup olmadığını kontrol et
		if (!browser) {
			console.log("🔄 Browser henüz hazır değil, yeniden başlatılıyor...");
			await initBrowser();

			// Browser'ın başlaması için biraz bekle
			await new Promise((resolve) => setTimeout(resolve, 3000));

			if (!browser) {
				throw new Error("Browser başlatılamadı");
			}
		}

		const htmlContent = generateInvoiceHTML(invoiceData, true);

		// Yeni sayfa oluştur
		const page = await browser.newPage();

		// Sayfa ayarlarını yap
		await page.setContent(htmlContent, { waitUntil: "networkidle0" });

		// PDF oluştur
		const pdfBuffer = await page.pdf({
			format: "A4",
			margin: {
				top: "20px",
				right: "20px",
				bottom: "20px",
				left: "20px",
			},
			printBackground: true,
		});

		// Sayfayı kapat
		await page.close();

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="fatura-${invoiceData.invoiceNumber}.pdf"`
		);
		res.send(pdfBuffer);

		console.log("✅ PDF başarıyla oluşturuldu");
	} catch (error) {
		console.error("❌ PDF oluşturma hatası:", error);

		// Browser'ı yeniden başlatmayı dene
		if (browser) {
			try {
				await browser.close();
				browser = null;
				console.log("🔄 Browser kapatıldı, yeniden başlatılacak...");
			} catch (closeError) {
				console.error("Browser kapatma hatası:", closeError);
			}
		}

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
	console.log(
		`🚀 Server http://localhost:${PORT} adresinde çalışıyor (Ubuntu + Bun)`
	);
	console.log(`📄 Fatura görüntüleme: http://localhost:${PORT}`);
	console.log(
		`📥 PDF indirme endpoint: GET http://localhost:${PORT}/generate-pdf`
	);
	console.log(`🔍 Browser durumu: GET http://localhost:${PORT}/browser-status`);
	console.log(
		`⚡ Runtime: Bun | OS: Ubuntu | Platform: ${process.platform} | Node.js: ${process.version}`
	);
	console.log(`🎯 Headless Chrome modu aktif (Google Chrome Stable)`);
	console.log(
		`🔧 Chrome Path: ${
			process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable"
		}`
	);
	console.log(`📁 User Data Dir: /tmp/puppeteer`);
});
