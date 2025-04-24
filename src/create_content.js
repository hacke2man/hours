function create_pdf_content(entries) {
  let entry_content = [];
  let total = 0;
  for (entry of entries) {
    let entry_total = 0;
    let spans_content = "";
    let base_comma = false;
    entry_content.push({
      svg: `<svg width="100%" height="2">
<line x1="0" y1="5" x2="100%" y2="5" stroke="black" stroke-width="1.5"/>
</svg>`,
      width: 520,
      margin: [0, 5, 0, 0]
    })
    for (let span of entry.spans) {
      entry_total += (span.end - span.start)/(1000 * 60 * 60);
      if (base_comma) {
        spans_content += ", ";
      } else { base_comma = true }
      spans_content += span.start.getUTCHours().toString().padStart(2, '0')
        + ":" + span.start.getUTCMinutes().toString().padStart(2, '0') + "-"
        + span.end.getUTCHours().toString().padStart(2, '0')
        + ":" + span.end.getUTCMinutes().toString().padStart(2, '0');
    }
    let year = entry.date.getFullYear();
    let month = entry.date.toLocaleString('default', { month: 'long' });
    let day = entry.date.getDate();
    entry_content.push([
      {
        columns: [
          {
            text: `${year} ${month} ${day}`,
          },
          { text: spans_content,
            style: "items",
            alignment: "center",
          },
          { text: "" + Math.round(entry_total * 100)/100,
            alignment: "right",
          }
        ],
        margin: [0, 0, 0, 10],
      },
    ]);

    let item_contents = [];
    for (item of entry.items) {
      if (item === '') { continue }
      item_contents.push({
        text: item,
        style: "items",
      });
    }
    entry_content.push(item_contents);
    entry_content.push({
      text: " ", margin: [0, 0, 0, 0]
    });
    total += entry_total;
  }

  let docDefinition = {
    header: (currentPage) => ({
      columns: [
        {
          text: "SȾÁ,SEN TŦE SENĆOŦEN Time Sheet",
          alignment: 'left',
          style: 'page_header',
          marginLeft: 20,
        },
        {
          text: currentPage.toString(),
          alignment: 'right',
          style: 'page_header',
          marginRight: 20,
        }
      ]
    }),
    content: [
      {text: "SȾÁ,SEN TŦE SENĆOŦEN Time Sheet", fontSize: 20, marginBottom: 20},
      {text: "Teacher/apprentice:", marginBottom: 20},
      entry_content,
      {
        svg: `<svg width="100%" height="2">
<line x1="0" y1="5" x2="100%" y2="5" stroke="black" stroke-width="1.5"/>
</svg>`,
        width: 520,
        margin: [0, 5, 0, 0]
      },
      {
        columns: [
          { text: "Total:" },
          { text: `${Math.round((total * 100))/100}`, alignment: 'right' },
        ]
      },
      { text: ' ', marginBottom: 40},
      {text: "Teacher/apprentice Signature:   _____________________", marginBottom: 10},
      {text: "Date:   _____________________", marginBottom: 10},
      {text: "Supervisor Signature:   _____________________", marginBottom: 10},
    ],
    defaultStyle: {
      font: "Liberation",
      fontSize: 16,
      color: '#1e1f1f',
      bold: true,
    },
    styles: {
      spans: {
        fontSize: 16,
        color: '#575a5b',
      },
      items: {
        fontSize: 16,
        color: '#575a5b',
        // bold: false,
      },
      page_header: {
        width: '*',
        marginTop: 10,
        fontSize: 10,
        color: '#444444',
      }
    }
  };

  return docDefinition;
}

function plain_text(entries) {
  let total = 0;
  for (entry of entries) {
    let entry_total = 0;
    let spans_content = "";
    let base_comma = false;
    for (let span of entry.spans) {
      entry_total += (span.end - span.start)/(1000 * 60 * 60);
      if (base_comma) {
        spans_content += ", ";
      } else { base_comma = true }
      spans_content += span.start.getUTCHours().toString().padStart(2, '0')
        + ":" + span.start.getUTCMinutes().toString().padStart(2, '0') + "-"
        + span.end.getUTCHours().toString().padStart(2, '0')
        + ":" + span.end.getUTCMinutes().toString().padStart(2, '0');
    }
    let year = entry.date.getFullYear();
    let month = entry.date.toLocaleString('default', { month: 'long' });
    let day = entry.date.getDate();
    console.log(`\x1b[34m${year} ${month} ${day}\x1b[0m`
      + " \x1b[0m" + spans_content + "\x1b[0m "
      + "\x1b[32m" + Math.round(entry_total * 100)/100 + "\x1b[0m");

    total += entry_total;
  }

  console.log("total: " + `\x1b[32m${Math.round((total * 100))/100}\x1b[0m`);
}

module.exports = {
  pdf_content: create_pdf_content,
  plain_text: plain_text,
}
