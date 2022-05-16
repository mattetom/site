---
title: "Add budget to Microsoft Azure service"
date: 2022-05-13T12:49:27+02:00
featureImage: images/allpost/MicrosoftAzureBudget.jpg
postImage: images/allpost/MicosoftAzureSetBudget.jpg
tags: Microsoft Azure
categories: blog
---

Have you ever received an unexpected Microsoft Azure billing?

Sometimes you are sure that the resources you are using on Microsoft Azure are the usual ones every month.
It was not noticed, for example, that for a few days there were a series of events for which the logs increased dramatically.

This is what happened to me last month:
quiet of using the classic resources, I found myself an invoice of almost double compared to the previous months.

### The problem
How was this possible?
I went to analyze the costs through the special tool, Cost Analysis, of the Azure portal https://portal.azure.com/.
I then found myself a peak, which lasted a few days, of using Azure Functions and Log Analysis.
Looking back on what happened in the month, I actually remembered a bug that plagued one of our applications that involved a heavy use of Azure Functions and, considering that we use Insight Analytics for the most critical operations, an anomalous use of Log Services.

I therefore thought about how to prevent this type of unexpected invoice in the future.
What I found on Microsoft Azure is the ability to set a monthly budget per resource.
In itself it may seem not a very useful thing, as if the anomaly happens in the very first days of the billing period you risk burning the entire budget before noticing the anomaly, but fortunately the tool allows you to set a budget threshold for which also be notified based on a forecast for the month.

### Hot to set budget
To set the budget, simply go to the Cost Management + Billing for Azure portal section and select Budgets in the menu on the left.
At this point we can create a new budget by setting the resource to be monitored, the monitoring period, and using the forecast of a convenient graph, set a budget threshold.
Moving on to the next section, you can set the threshold percentage at which we want to be notified and the email to which to send the notification.
In a few hours the budget will be set and we can go back to sleep peacefully.
