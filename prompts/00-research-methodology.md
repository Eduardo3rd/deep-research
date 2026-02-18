## Research Methodology

### Source Hierarchy (in order of credibility)

**Tier 1 — Primary Sources (highest weight)**
- SEC filings (10-K, 10-Q, S-1, proxy statements)
- Company press releases, blog posts, and newsroom
- Investor presentations and earnings calls
- Patent filings (USPTO, EPO, WIPO)
- Official product documentation and spec sheets
- Direct customer case studies on company website

**Tier 2 — Verified Secondary Sources**
- Major financial news (WSJ, Bloomberg, Reuters, FT)
- Credible tech/industry press (TechCrunch, The Information, Axios)
- Industry analyst reports (Gartner, Forrester, IDC)
- Research platforms (Contrary Research, Sacra, CBInsights)
- Government databases (FPDS for contracts, FDA for approvals)
- Trade publications (industry-specific)

**Tier 3 — Triangulation Sources**
- Funding databases (Crunchbase, PitchBook, Tracxn)
- Employee sentiment (Glassdoor, Blind, RepVue, Levels.fyi)
- Job postings (LinkedIn, company careers page)
- Social media (LinkedIn posts, Twitter/X, YouTube interviews)
- Podcast appearances by founders/executives
- Conference presentations and demo videos

**Tier 4 — Directional Sources (use with skepticism)**
- Reddit discussions (r/startups, industry subreddits)
- Quora answers
- Anonymous sources
- Competitor marketing materials
- Unverified revenue estimates

### Search Strategy Templates

```
# Company basics
"{{COMPANY_NAME}}" founded OR founding story OR origin
"{{COMPANY_NAME}}" mission OR vision statement
site:{{COMPANY_DOMAIN}} about OR team OR leadership

# Funding & financials
"{{COMPANY_NAME}}" funding OR series OR raised
"{{COMPANY_NAME}}" valuation OR worth
"{{COMPANY_NAME}}" revenue OR ARR OR growth rate
"{{COMPANY_NAME}}" profitable OR profitability OR burn rate
"{{COMPANY_NAME}}" annual report OR 10-K OR investor

# Products & technology
"{{COMPANY_NAME}}" product OR platform OR solution
"{{COMPANY_NAME}}" technology OR architecture OR stack
"{{COMPANY_NAME}}" patent OR intellectual property
"{{COMPANY_NAME}}" API OR integration OR SDK

# Market & competition
"{{COMPANY_NAME}}" vs OR versus OR compared to
"{{COMPANY_NAME}}" competitor OR alternative
"{{COMPANY_NAME}}" market share OR position
"{{COMPANY_NAME}}" TAM OR market size

# Customers & GTM
"{{COMPANY_NAME}}" customer OR client OR case study
"{{COMPANY_NAME}}" testimonial OR review
"{{COMPANY_NAME}}" partnership OR partner
"{{COMPANY_NAME}}" pricing OR cost

# People & organization
"{{CEO_NAME}}" interview OR podcast OR keynote
"{{COMPANY_NAME}}" VP OR director OR leadership team
"{{COMPANY_NAME}}" hiring OR jobs OR careers
"{{COMPANY_NAME}}" glassdoor OR culture OR workplace
"{{COMPANY_NAME}}" organizational structure
site:linkedin.com "{{COMPANY_NAME}}"

# Risks & news
"{{COMPANY_NAME}}" lawsuit OR legal OR litigation
"{{COMPANY_NAME}}" controversy OR scandal OR criticism
"{{COMPANY_NAME}}" layoffs OR restructuring
"{{COMPANY_NAME}}" expansion OR new facility
"{{COMPANY_NAME}}" acquisition OR merger
"{{COMPANY_NAME}}" news 2025 OR 2026
```

### Data Triangulation Requirements

For every critical metric, seek **3+ independent sources**:

| Metric Type | Source 1 | Source 2 | Source 3 |
|-------------|----------|----------|----------|
| Revenue | Company disclosure | Third-party estimate | Back-calculation from headcount/funding |
| Valuation | Funding announcement | Secondary market | Comparable analysis |
| Employee count | LinkedIn | Company statement | Glassdoor/jobs |
| Customer count | Company claims | Case study count | Partner integrations |
| Market size | Analyst report 1 | Analyst report 2 | Bottom-up calculation |

**If sources conflict, document all values and your confidence-weighted estimate.**

### Citation Requirements

Every factual claim must include:
- Source name and URL
- Publication/access date
- Confidence level: `[Confirmed]`, `[Estimated]`, `[Speculated]`

Example:
> Revenue reached $67.8M in 2025 [Confirmed] — Source: [GetLatka](https://getlatka.com/companies/example), accessed Jan 2026

### Data Presentation

Use tables for quantitative data:

```markdown
| Metric | Value | Source | Confidence | Date |
|--------|-------|--------|------------|------|
| Revenue | $68M | GetLatka | Confirmed | 2025 |
| Employees | 153 | LinkedIn | Estimated | Jan 2026 |
```

### Contradiction Handling

When sources disagree:
```markdown
**Revenue Estimates (Conflicting):**
- GetLatka: $67.8M [Jan 2025]
- Tracxn: $45M [Dec 2024]
- PitchBook: $50-75M range [Nov 2024]

**Reconciliation:** GetLatka estimate appears most current and aligns with
Deloitte Fast 500 ranking math. Using $68M as working estimate.
```

### Gap Documentation

Every research file must end with:
```markdown
## Information Gaps

### Critical (blocks key decisions)
- [Gap description]

### Important (affects analysis quality)
- [Gap description]

### Nice-to-have (enhances conviction)
- [Gap description]
```
