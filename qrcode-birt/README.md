# Introduction
Customers have traditionally embedded bar codes (Code 39, Code 128, etc.) in BIRT reports. This required utilizing external services (sending data from your Maximo system to a third-party via webservice) or required deploying bar code fonts to the server. And depending on the barcode type, java libraries to encode the value properly. As QR codes have become more of an industry standard, we wanted to provide the ability to generate a QR code within a BIRT report without relying on any external services and without the complexity of deploying custom java libaries and/or fonts. 

# Install
The `NAVIAM.QRCODE` script should be deployed in your Maximo instance. This can be deployed via Naviam's Maximo Development Tools or mnaually created as a script without a launch point. 

# Adding a QR Code to a BIRT report

## Report Initialize
The first step is retrieving the script in the BIRT report. On the report initialize, add the script below. This is done in the report initialize to avoid fetching the script multiple times if being used on multiple records. This will create a global variable NaviamQRCode that we can utilize throughout the report to generate the QR code.

```javascript
qrScriptDataSet = MXReportDataSetProvider.create("maximoDataSource", "qrScriptDataSet");
qrScriptDataSet.open();

qrScriptSQL = "select source from autoscript where autoscript = 'NAVIAM.QRCODE'";
	
qrScriptDataSet.setQuery(qrScriptSQL);
var scriptSrc = "";
if(qrScriptDataSet.fetch()) {
	scriptSrc = qrScriptDataSet.getString("source");
}

qrScriptDataSet.close();
var NaviamQRCode=mxReportScriptContext.getBirtReportContext().evaluate(scriptSrc);
```

![Report Initialize](images/report_initialize.png)


## Data Set
The next step is to define an Output Column in your BIRT Data Set. Right click the Data Set and choose Edit.

![Data Set Edit](images/dataset_edit.png)

Switch to Output Columns and add a new column. In our example we will use qrcode for the Column Name. It is important that the type is set to Blob.

![Data Set New Column](images/dataset_newcolumn.png)

Click OK on that dialog and click OK to close the Edit Data Set dialog.

With the Data Set selected, click the Script tab and switch the event from open to fetch. Add the following code before the return (true)
```javascript
var svgString = new Packages.java.lang.String(NaviamQRCode(row["wonum"]));
row["qrcode"]=svgString.getBytes();
```

NOTE: You must replace the row["wonum"] with the appropriate column for your dataset (assetnum, itemnum, ponum, etc.)

![Data Set Fetch](images/dataset_fetch.png)

## Table Binding
The next step is to select the table and add a new Data Column Binding.

Name: qrcode

Data Type: Blob

Export: Allow Export checked

Expression: dataSetRow["qrcode"]

![Table Binding](images/table_binding.png)

Click OK on that dialog.

## Image control
From the Palette, drag the Image control on the report where you want it to display. If this is going to be displayed in the header, you typically will want it in the Table Group Header (if one exists) rather than the Report Header. The Report Header will render on top of every page in the report but the QR code would be based on the first record in the result set. If you had work order 1001, 1002, and 1003 in a WOPRINT report, the QR code in the report header would display 1001 on each of the pages. 

The Table Group Header will group by the identifier (such as wonum & siteid for WORKORDER) and will display the desired QR code for each record. 

Select Image from: Dynamic image
Enter dynamic image expression: row["qrcode"]

![Image Settings](images/image_settings.png)

On the Property Editor, in the General Tab, specify the desired width in pixels.

![Image General Properties](images/image_general_properties.png)

On the Property Editor, in the Advanced tab, scroll to the Type expression and set it to "image/svg+xml". ***This is critical or the QR code will not be visible in the report.***

![Image Advanced Properties](images/image_advanced_properties.png)

