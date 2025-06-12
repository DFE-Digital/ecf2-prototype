// Change versions here
var v = '/v11/'
var vGet = 'v11/'

// Add any directory variables here
var school = 'school/'
var mentor = 'mentor/'
var admin = 'admin/'

module.exports = router => {

    router.use((req, res, next) => {
        // Override session data if the environment variable is set
        if (process.env.ENVIRONMENT === 'research' && !req.session.data['variablesInitialized']) {
            req.session.data['ab'] = process.env.AB;
            req.session.data['deliveryPartner'] = process.env.DP;
            req.session.data['leadProvider'] = process.env.LP;
            req.session.data['programmeType'] = process.env.PROG;
            req.session.data['schoolName'] = process.env.SCHOOLNAME;

            // Mark session variables as initialized
            req.session.data['variablesInitialized'] = true;
        }
        next();
    });

    // start page
    router.post(v + school + 'start', (req, res) => {
        if (req.query.rollover === 'yes') {
            req.session.data['transferJourney'] = ''
            req.session.data['defaultsAlreadyAdded'] = 'yes'
        }
        if (req.query.transfer === 'yes') {
            req.session.data['defaultsAlreadyAdded'] = ''
            req.session.data['transferJourney'] = 'yes'
        }
        if (req.query.mentorTransfer === 'yes') {
            req.session.data['defaultsAlreadyAdded'] = ''
            req.session.data['mentorTransfer'] = 'yes'
        }
        res.redirect(v + school + 'dfe-sign-in')
    })

    // dfe sign in page
    router.post(v + school + 'dfe-sign-in', (req, res) => {
        res.redirect(v + school + 'home/ects')
    })

    // **** prototype set up ****

    router.post(v + school + 'setup', (req, res) => {
        res.redirect(v + school + 'start')
    })

    // **** set up custom scenarios ****

    router.get(v + school + 'setup-scenario-1', (req, res) => {
        req.session.data['transferJourney'] = ''
        req.session.data['defaultsAlreadyAdded'] = 'no'
        res.redirect(v + school + 'start')
    })

    router.get(v + school + 'setup-scenario-2', (req, res) => {
        req.session.data['transferJourney'] = ''
        req.session.data['defaultsAlreadyAdded'] = 'yes'
        res.redirect(v + school + 'start?rollover=yes')
    })

    router.get(v + school + 'setup-scenario-3', (req, res) => {
        req.session.data['defaultsAlreadyAdded'] = ''
        req.session.data['transferJourney'] = 'yes'
        res.redirect(v + school + 'start?transfer=yes')
    })

    router.get(v + school + 'setup-scenario-4', (req, res) => {
        req.session.data['defaultsAlreadyAdded'] = ''
        req.session.data['mentorTransfer'] = 'yes'
        res.redirect(v + school + 'start?mentorTransfer=yes')
    })

    // what you'll need
    router.post(v + school + 'what-youll-need', (req, res) => {
        res.redirect(v + school + 'find-ect')
    })

    // add ECT from here

    router.post(v + school + 'find-ect', (req, res) => {
        if (req.session.data['askForNino'] === 'yes') {
            res.redirect(v + school + 'nino')
        }
        if (req.session.data['trn'] === '9999999') {
            res.redirect(v + school + 'nino')
        }
        else {
            res.redirect(v + school + 'review-ect-details')
        }
    })

    router.post(v + school + 'nino', (req, res) => {
        if (req.session.data['nino'].startsWith('Z')) {
            res.redirect(v + 'other-pages/add-ect/not-found')
        }
        else {
            req.session.data['askForNino'] = 'yes'
            res.redirect(v + school + 'review-ect-details')
        }
    })

    router.post(v + school + 'review-ect-details', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + 'check-answers')
        }
        if (req.session.data.transferJourney === 'yes') {
            res.redirect(v + school + 'previously-training')
        }
        else {
            res.redirect(v + school + 'email-address')
        }
    })

    router.post(v + school + 'previously-training', (req, res) => {
        res.redirect(v + school + 'email-address')
    })

    router.post(v + school + 'email-address', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + 'check-answers')
        }
        else {
            res.redirect(v + school + 'start-month')
        }
    })

    router.post(v + school + 'start-month', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + 'check-answers')
        }
        else {
            res.redirect(v + school + 'part-time')
        }
    })

    router.post(v + school + 'part-time', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + 'check-answers')
        }
        else if (req.session.data['transferJourney'] === 'yes') {
            res.redirect(v + school + 'will-you-use-defaults')
        }
        else if (req.session.data['defaultsAlreadyAdded'] === 'yes') {
            res.redirect(v + school + 'will-you-use-defaults')
        }
        else {
            res.redirect(v + school + 'appropriate-body')
        }
    })

    router.post(v + school + 'transfer-existing', (req, res) => {
        if (req.session.data['useDefaults'] === 'no') {
            res.redirect(v + school + 'appropriate-body')
        }
        else {
            if (req.session.data['mentorsAddedPreviously'] === 'no') {
                res.redirect(v + school + 'check-answers')
            }
            else {
                res.redirect(v + school + 'check-answers')
            }
        }
    })


    router.post(v + school + 'will-you-use-defaults', (req, res) => {
        if (req.session.data['useDefaults'] === 'yes' && req.session.data['programmeType'] !== 'School-led') {
            req.session.data['showDp'] = true
        }
        if (req.session.data['useDefaults'] === 'no') {
            req.session.data['showDp'] = ''
            res.redirect(v + school + 'appropriate-body')
        }
        else {
            if (req.session.data['mentorsAddedPreviously'] === 'no') {
                res.redirect(v + school + 'check-answers')
            }
            else {
                res.redirect(v + school + 'check-answers')
            }
        }
    })

    // adding programme information that is not default

    router.post(v + school + 'appropriate-body', (req, res) => {
        if (req.session.data['ab'] === undefined) {
            req.session.data['ab'] = 'Alpha Teaching School Hub'
        }
        if (req.query.change === 'yes') {
            req.session.data.changeProg = 'yes'
        }
            res.redirect(v + school + 'programme-type')
    })

    router.post(v + school + 'programme-type', (req, res) => {
        if (req.query.change === 'yes') {
            req.session.data.changeProg = 'yes'
        }
        if (req.session.data['programmeType'] === 'School-led') {
            // res.redirect(v + school + 'save-programme-details')
            res.redirect(v + school + 'check-answers')
        }
        else {
            req.session.data['programmeType'] = 'Provider-led'
            res.redirect(v + school + 'lead-provider')
        }
    })

    router.post(v + school + 'lead-provider', (req, res) => {
        if (req.session.data['leadProvider'] === undefined) {
            req.session.data['leadProvider'] = 'Ambition Institute'
        }
        if (req.query.change === 'yes') {
            req.session.data.changeProg = 'yes'
        }
        req.session.data['showDp'] = false
        res.redirect(v + school + 'check-answers')
    })

    router.post(v + school + 'also-delivering', (req, res) => {
        if (req.session.data['alsoDelivering'] === 'Yes' || req.session.data['alsoDelivering'] === undefined) {
            req.session.data['deliveryPartner'] = req.session.data['ab']
        }
        if (req.query.change === 'yes') {
            req.session.data.changeProg = 'yes'
        }
        // res.redirect(v + school + 'save-programme-details')
        res.redirect(v + school + 'check-answers')
    })


    router.post(v + school + 'autocomplete-delivery-partner', (req, res) => {
        const dp = req.session.data['deliveryPartner'] ? req.session.data['deliveryPartner'].trim() : '';
        console.log('Delivery Partner:', dp);
        console.log('DP/LP pairings:', dpLp);
        const correspondingValue = dpLp[dp] || dpLp[dp.toLowerCase()] || dpLp[dp.toUpperCase()];
        if (correspondingValue) {
            req.session.data.leadProvider = correspondingValue;
        } else {
            req.session.data.leadProvider = 'Ambition Institute'
        }
        console.log('Lead Provider:', req.session.data.leadProvider);
        if (req.query.change === 'yes') {
            req.session.data.changeProg = 'yes'
        }
        // res.redirect(v + school + 'save-programme-details')
        res.redirect(v + school + 'check-answers')
    })

    router.post(v + school + 'save-programme-details', (req, res) => {
        if (req.session.data['mentorsAddedPreviously'] === 'no') {
            if (req.query.change === 'yes') {
                req.session.data.changeProg = ''
            }
            res.redirect(v + school + 'check-answers')
        }
        else {
            req.session.data['defaultsAlreadyAdded'] = 'yes'
            if (req.session.data.changeProg === 'yes') {
                req.session.data.changeProg = ''
                res.redirect(v + school + 'check-answers')
            }
            else {
                res.redirect(v + school + 'check-answers')
            }
        }
    })

    // end of adding non-default programme information

    router.post(v + school + 'mentor', (req, res) => {
        res.redirect(v + school + 'check-answers')
    })

    router.post(v + school + 'check-answers', (req, res) => {
        req.session.data['askForNino'] = ''
        req.session.data['ectAdded'] = 'yes'
        req.session.data['fullName'] = undefined
        req.session.data['defaultsAlreadyAdded'] = 'yes'
        if (req.session.data['mentor'] === 'Someone else' || req.session.data['mentorsAddedPreviously'] === 'no') {
            req.session.data['ectAddedWithoutMentor'] = 'yes'
            res.redirect(v + school + 'confirmation-mentor-to-be-added')
        }
        else {
            req.session.data['ectAddedWithoutMentor'] = 'yes'
            res.redirect(v + school + 'confirmation')
        }
    })

    // mentor journeys

    router.get(v + school + mentor + 'add-mentor', (req, res) => {
        req.session.data['mentorTransfer'] = ''
        res.redirect(v + school + mentor + 'who-will-be-mentoring')
    })

    router.get(v + school + mentor + 'mentor-transfer', (req, res) => {
        req.session.data['mentorTransfer'] = 'yes'
        res.redirect(v + school + mentor + 'who-will-be-mentoring')
    })

    router.post(v + school + mentor + 'who-will-be-mentoring', (req, res) => {
        if (req.session.data ['mentor'] === 'Register a new mentor'){
            req.session.data['askForNino'] = null
            res.redirect(v + school + mentor + 'what-youll-need')
        }
        else {
            req.session.data['ectAddedWithoutMentor'] = ''
            res.redirect(v + school + mentor + 'assigned')
        }
    })

    router.post(v + school + mentor + 'what-youll-need', (req, res) => {
        res.redirect(v + school + mentor + 'find-mentor')
    })

    router.post(v + school + mentor + 'mentor-will-be-assigned-to', (req, res) => {
        res.redirect(v + school + mentor + 'find-mentor')
    })

    router.post(v + school + mentor + 'find-mentor', (req, res) => {
        if (req.session.data['trn'] === '9999999') {
            res.redirect(v + school + mentor + 'nino')
        }
        if (req.query.alreadyexists === 'yes') {
            res.redirect(v + 'other-pages/add-mentor/mentor-already-registered')
        }
        else {
            res.redirect(v + school + mentor + 'review-mentor-details')
        }
    })

    router.post(v + school + mentor + 'nino', (req, res) => {
        if (req.session.data['nino'].startsWith('Z')) {
            res.redirect(v + 'other-pages/add-mentor/not-found')
        }
        else {
            req.session.data['askForNino'] = 'yes'
            res.redirect(v + school + mentor + 'review-mentor-details')
        }
    })

    router.post(v + school + mentor + 'review-mentor-details', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + mentor + 'check-answers')
        }
        else if (req.session.data.mentorTransfer === 'yes') {
            res.redirect(v + school + mentor + 'start-month')
        }
        else {
            res.redirect(v + school + mentor + 'email-address')
        }
    })

    router.post(v + school + mentor + 'start-month', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + mentor + 'check-answers')
        }
        else {
            res.redirect(v + school + mentor + 'email-address')
        }
    })

    router.post(v + school + mentor + 'email-address', (req, res) => {
        if (req.query.change === 'yes') {
            res.redirect(v + school + mentor + 'check-answers')
        }
        if (req.session.data.mentorTransfer === 'yes') {
            res.redirect(v + school + mentor + 'mentor-at-other-school')
        }
        else if (req.session.data['programmeType'] === 'School-led') {
            res.redirect(v + school + mentor + 'check-answers')
        }
        else {
            res.redirect(v + school + mentor + 'will-receive-mentor-training')
        }
    })

    router.post(v + school + mentor + 'mentor-at-other-school', (req, res) => {
        if (req.session.data['mentorOnly'] === 'no') {
            res.redirect(v + school + mentor + 'check-answers')
        }
        else if (req.session.data['programmeType'] === 'School-led') {
            res.redirect(v + school + mentor + 'check-answers')
        }
        else {
            res.redirect(v + school + mentor + 'previously-training')
        }
    })

    router.post(v + school + mentor + 'previously-training', (req, res) => {
        res.redirect(v + school + mentor + 'will-you-use-defaults')
    })

    router.post(v + school + mentor + 'will-receive-mentor-training', (req, res) => {
        req.session.data['showLp'] = 'yes'
        res.redirect(v + school + mentor + 'check-answers')
    })

    router.get(v + school + mentor + 'select-lead-provider', (req, res) => {
        req.session.data['showLp'] = 'yes'
        res.redirect(v + school + mentor + 'lead-provider')
    })

    router.post(v + school + mentor + 'will-you-use-defaults', (req, res) => {
        if (req.session.data['useDefaults'] === 'yes') {
            req.session.data['showDp'] = true
        }
        if (req.session.data['useDefaults'] === 'no') {
            res.redirect(v + school + mentor + 'lead-provider')
        }
        else {
            res.redirect(v + school + mentor + 'check-answers')
        }
    })

    router.post(v + school + mentor + 'lead-provider', (req, res) => {
        if (req.session.data['leadProvider'] === undefined) {
            req.session.data['leadProvider'] = 'Ambition Institute'
        }
        req.session.data['showDp'] = false
        res.redirect(v + school + mentor + 'check-answers')
    })

    router.post(v + school + mentor + 'check-answers', (req, res) => {
        req.session.data['fullName'] = undefined
        req.session.data['ectAddedWithoutMentor'] = ''
        req.session.data['showLp'] = ''
        res.redirect(v + school + mentor + 'confirmation')
    })

    // other pages

    router.post(v + 'other-pages/add-mentor/mentor-already-registered', (req, res) => {
        req.session.data['mentor'] = 'Tom Jones'
        res.redirect(v + school + mentor + 'assigned')
    })

    // **********************
    // **********************
    // **********************

        // finance home page - direct access
        router.get(v + admin + 'finance-home', (req, res) => {
            const financeData = req.session.data.financeData || [];
            
            // Get query parameters for filtering
            const provider = req.query.provider || 'All';
            const year = req.query.year || 'All';
            const date = req.query.date || 'All';
            const statementType = req.query.statementType || 'Output statements';
            
            // Apply filters to the data
            let filteredData = [...financeData];
            
            if (provider !== 'All') {
                filteredData = filteredData.filter(item => item.provider === provider);
            }
            
            if (year !== 'All') {
                filteredData = filteredData.filter(item => item.contractYear === parseInt(year));
            }
            
            if (date !== 'All') {
                filteredData = filteredData.filter(item => item.statement === date);
            }
            
            if (statementType !== 'All') {
                if (statementType === 'Output statements') {
                    // Filter for Open, Payable, and Authorised for payment
                    filteredData = filteredData.filter(item => 
                        item.status === 'Open' || 
                        item.status === 'Payable' || 
                        item.status === 'Authorised for payment'
                    );
                } else if (statementType === 'Service fee statements') {
                    // Filter for Service fee statement
                    filteredData = filteredData.filter(item => item.status === 'Service fee statement');
                }
            }
            
            // Sort data by contract year and then by statement date
            filteredData.sort((a, b) => {
                // First sort by contract year (ascending)
                if (a.contractYear !== b.contractYear) {
                    return a.contractYear - b.contractYear;
                }
                
                // If same contract year, sort by statement date
                const aDateParts = a.statement.split(' ');
                const bDateParts = b.statement.split(' ');
                
                const aMonth = aDateParts[0];
                const aYear = parseInt(aDateParts[1]);
                
                const bMonth = bDateParts[0];
                const bYear = parseInt(bDateParts[1]);
                
                // Sort by year first
                if (aYear !== bYear) {
                    return aYear - bYear;
                }
                
                // If same year, sort by month
                const monthOrder = {
                    "January": 1, 
                    "February": 2, 
                    "March": 3, 
                    "April": 4, 
                    "May": 5, 
                    "June": 6, 
                    "July": 7, 
                    "August": 8, 
                    "September": 9, 
                    "October": 10, 
                    "November": 11, 
                    "December": 12
                };
                
                return monthOrder[aMonth] - monthOrder[bMonth];
            });
            
            // Pagination logic
            const page = parseInt(req.query.page) || 1;
            const itemsPerPage = 20;
            const totalItems = filteredData ? filteredData.length : 0;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            
            // Calculate the start and end indices for the current page
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            
            // Get the subset of data for the current page
            const currentPageData = filteredData ? filteredData.slice(startIndex, endIndex) : [];
            
            // Generate pagination items
            const paginationItems = [];
            
            // Add ellipsis logic for many pages
            const showEllipsisStart = page > 3;
            const showEllipsisEnd = page < totalPages - 2;
            
            // Build the base query string for pagination links
            const baseQueryString = Object.entries(req.query)
                .filter(([key]) => key !== 'page')
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');
            
            const getPageUrl = (pageNum) => {
                const separator = baseQueryString ? '&' : '';
                return `${v}${admin}finance-home?${baseQueryString}${separator}page=${pageNum}`;
            };
            
            // Add page numbers
            for (let i = 1; i <= totalPages; i++) {
                // Show first and last pages, and pages around the current page
                if (
                    i === 1 || 
                    i === totalPages || 
                    (i >= page - 1 && i <= page + 1) ||
                    (i === 2 && page <= 3) ||
                    (i === totalPages - 1 && page >= totalPages - 2)
                ) {
                    paginationItems.push({
                        number: i,
                        current: i === page,
                        href: getPageUrl(i)
                    });
                } 
                // Add ellipsis (as a non-link item)
                else if (
                    (i === 2 && showEllipsisStart) || 
                    (i === totalPages - 1 && showEllipsisEnd)
                ) {
                    paginationItems.push({
                        ellipsis: true
                    });
                }
            }
            
            // Determine previous and next links
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
            
            // Render with pagination data
            res.render(vGet + '/admin/finance-home', {
                financeStatements: currentPageData,
                pagination: {
                    items: paginationItems,
                    previous: prevPage ? {
                        href: getPageUrl(prevPage)
                    } : null,
                    next: nextPage ? {
                        href: getPageUrl(nextPage)
                    } : null
                },
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalItems,
                query: req.query
            });
        })
    
        // finance statement page
        router.get(v + admin + 'finance/statement', (req, res) => {
            // Check if we should show banners (and then clear the flags)
            const showRemovedBanner = req.session.data.showAdjustmentRemovedBanner;
            const showAddedBanner = req.session.data.showAdjustmentAddedBanner;
            const showChangedBanner = req.session.data.showAdjustmentChangedBanner;
            
            if (showRemovedBanner) {
                req.session.data.showAdjustmentRemovedBanner = false;
            }
            if (showAddedBanner) {
                req.session.data.showAdjustmentAddedBanner = false;
            }
            if (showChangedBanner) {
                req.session.data.showAdjustmentChangedBanner = false;
            }

            // Pass the query parameters to the template
            res.render(vGet + '/admin/finance/statement', {
                query: req.query,
                showAdjustmentRemovedBanner: showRemovedBanner,
                showAdjustmentAddedBanner: showAddedBanner,
                showAdjustmentChangedBanner: showChangedBanner
            });
        })
    
        // add adjustment page
        router.get(v + admin + 'finance/add-adjustment', (req, res) => {
            // Pass the query parameters to the template
            res.render(vGet + '/admin/finance/add-adjustment', {
                query: req.query
            });
        })
    
        // handler for statement page form submission
        router.get(v + admin + 'finance/find-statement', (req, res) => {
            const provider = req.query.provider;
            const contractYear = req.query.contractYear;
            const statement = req.query.statement;
            
            // If any are "All", redirect to finance-home with filters
            if (provider === "All" || contractYear === "All" || statement === "All") {
                const queryString = Object.entries(req.query)
                    .filter(([key, value]) => value !== "All")
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join('&');
                
                return res.redirect(`${v}${admin}finance-home?${queryString}`);
            }
            
            // Check if the requested statement exists
            const financeData = req.session.data.financeData || [];
            
            const matchingStatement = financeData.find(item => 
                item.provider === provider && 
                item.contractYear.toString() === contractYear &&
                item.statement === statement
            );
            
            if (matchingStatement) {
                // Statement exists, redirect to it
                return res.redirect(`${v}${admin}finance/statement?provider=${encodeURIComponent(provider)}&contractYear=${contractYear}&statement=${encodeURIComponent(statement)}`);
            } else {
                // Statement doesn't exist, redirect to finance-home with filters
                return res.redirect(`${v}${admin}finance-home?provider=${encodeURIComponent(provider)}&year=${contractYear}&date=${encodeURIComponent(statement)}`);
            }
        })

    // **********************
    // **********************

    // Admin tooling and other stuff

    router.post(v + 'admin/finance/add-adjustment', (req, res) => {
        // Pull the values out of req.body (form submission data)
        const { adjustmentName, amount, provider, contractYear, statement, editIndex } = req.body;

        // Ensure req.session.data.adjustmentArray exists
        if (!Array.isArray(req.session.data.adjustmentArray)) {
            req.session.data.adjustmentArray = [];
        }

        // Check if this is an edit operation
        if (editIndex !== undefined && editIndex !== null && editIndex !== '') {
            // Update existing adjustment
            const index = parseInt(editIndex);
            if (index >= 0 && index < req.session.data.adjustmentArray.length) {
                req.session.data.adjustmentArray[index] = {
                    adjustmentName: adjustmentName,
                    amount: amount
                };
                // Set flag to show change banner
                req.session.data.showAdjustmentChangedBanner = true;
            }
        } else {
            // Append a new object
            req.session.data.adjustmentArray.push({
                adjustmentName: adjustmentName,
                amount: amount
            });
            // Set flag to show add banner
            req.session.data.showAdjustmentAddedBanner = true;
        }

        // Redirect back with the query parameters to maintain context
        const queryParams = new URLSearchParams({
            provider: provider || '',
            contractYear: contractYear || '',
            statement: statement || ''
        }).toString();

        res.redirect(v + 'admin/finance/statement?' + queryParams);
    });

    // Remove adjustment route
    router.get(v + admin + 'finance/remove-adjustment', (req, res) => {
        const { provider, contractYear, statement, index } = req.query;
        
        // Ensure req.session.data.adjustmentArray exists
        if (!Array.isArray(req.session.data.adjustmentArray)) {
            req.session.data.adjustmentArray = [];
        }

        // Remove the adjustment at the specified index
        const adjustmentIndex = parseInt(index);
        if (adjustmentIndex >= 0 && adjustmentIndex < req.session.data.adjustmentArray.length) {
            req.session.data.adjustmentArray.splice(adjustmentIndex, 1);
        }

        // Set flag to show removal banner
        req.session.data.showAdjustmentRemovedBanner = true;

        // Redirect back to statement with query parameters
        const queryParams = new URLSearchParams({
            provider: provider || '',
            contractYear: contractYear || '',
            statement: statement || ''
        }).toString();

        res.redirect(v + 'admin/finance/statement?' + queryParams);
    });
}