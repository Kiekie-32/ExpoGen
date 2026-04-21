

async function run() {
  const payload = {
    product_id: 40,
    consignee_name: "",
    consignee_address: "",
    quantity: " kg",
    quantity_value: 0,
    price_per_unit: 0,
    total_price: 0,
    incoterms: "",
    port_name: "Tema Port",
    payment_terms: "30% deposit, 70% against documents",
    governing_law: "Ghana",
    dispute_resolution: "Arbitration in Accra"
  };

  try {
    const res1 = await fetch('https://expo-gen-rose.vercel.app/products/40/documents/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    console.log('/products/40/documents/generate status:', res1.status);
    console.log(await res1.text());
  } catch (e) { console.error(e.message); }
}
run();
