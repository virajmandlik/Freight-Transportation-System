from flask import Flask, render_template, request, send_file
import qrcode
import os

app = Flask(__name__)
QR_DIR = 'static/qrs'

# Ensure QR directory exists
os.makedirs(QR_DIR, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pay', methods=['POST'])
def pay():
    upi_id = request.form['upi_id']
    name = request.form['name']
    amount = request.form['amount']

    upi_url = f"upi://pay?pa={upi_id}&pn={name}&am={amount}&cu=INR"
    qr_img = qrcode.make(upi_url)

    filename = f"{upi_id.replace('@', '_')}_{amount}.png"
    qr_path = os.path.join(QR_DIR, filename)
    qr_img.save(qr_path)

    # Just pass the filename, not the full path
    return render_template('success.html', upi_url=upi_url, qr_file=filename, upi_id=upi_id, amount=amount)

if __name__ == '__main__':
    app.run(debug=True)