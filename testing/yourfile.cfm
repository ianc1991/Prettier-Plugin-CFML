<cfoutput>
<html>
<head>
<title>Complex CFML Page</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<!-- Main content section -->
<cfif isDefined("session.user")>
<h1>Welcome, #session.user#</h1>
<cfloop query="userData">
<div class="user">
<h2>User Information</h2>
<cfoutput>
<p>Name: #userData.name#</p>
<p>Email: #userData.email#</p>
</cfoutput>
<cfif userData.isAdmin>
<p><strong>Administrator Access</strong></p>
<cfelse>
<p>Standard User</p>
</cfif>
</div>
</cfloop>
<cfelse>
<h1>Please log in</h1>
<cfinclude template="login.cfm">
</cfif>

<!-- Nested logic and CF tags -->
<cfset totalUsers = queryRecordCount(userData)>
<cfif totalUsers GT 0>
<cfloop index="i" from="1" to="#totalUsers#">
<cfset currentUser = userData[i]>
<cfoutput>
<div class="user-details">
<h3>User #i# Details:</h3>
<p>#currentUser.name# (#currentUser.email#)</p>
</div>
</cfoutput>
<cfif i EQ totalUsers>
<p>All users have been displayed.</p>
</cfif>
</cfloop>
</cfif>

<!-- Self-closing CFML tags -->
<cfset myVar = "Test Value" />
<cfparam name="request.variable" default="defaultValue" />
<cfinclude template="footer.cfm" />

</body>
</html>
</cfoutput>
