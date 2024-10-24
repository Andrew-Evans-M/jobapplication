import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { setJobs, markApplied } from '../redux/action/JobSlice';
import { Modal, Button, Card, Badge, FormControl } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { getAllJobs } from '../redux/requests/ApplicationApi';
import Select from 'react-select';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../pages/joblist.css";

const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  skills: Yup.array().min(1, 'At least one skill is required'),
  aboutMe: Yup.string().required('Tell us about yourself')
});

const JobList = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  const [show, setShow] = useState(false);
  const [applyModal, setApplyModal] = useState(false); 
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // New search state

  const jobsPerPage = 9;

  useEffect(() => {
    fetchJobs();
  }, [dispatch]);

  const fetchJobs = async () => {
    try {
		const response = await getAllJobs();
		const sortedJobs = response.data.sort((a: any, b: any) => {
		  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});      
		dispatch(setJobs(sortedJobs)); 
    } catch (error) {
	  throw error;
    }
  };

  const handleShow = (job: any) => {
    setSelectedJob(job);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleApply = (e:any,job: any) => {
    e?.stopPropagation();
    setSelectedJob(job);
    setApplyModal(true); 
  };

  const handleApplyFormClose = () => setApplyModal(false);

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * jobsPerPage;
//   const currentJobs = jobs.slice(offset, offset + jobsPerPage);

  

  const handleSubmit = (values: any) => {
    dispatch(markApplied(selectedJob.id));
    setApplyModal(false);
    alert('Job applied successfully!');
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0); // Reset to the first page on search
  };

  const skillOptions = [
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'CSS', label: 'CSS' },
  ];

  const filteredJobs = jobs.filter((job) => {
	const jobTitle = typeof job.title === 'string' ? job.title.toLowerCase() : '';
	const companyName = typeof job.companyName === 'string' ? job.companyName.toLowerCase() : '';
	const query = searchTerm.toLowerCase();
	
	return (
	  jobTitle.includes(query) ||
	  companyName.includes(query)
	);
  });

  const currentJobs = filteredJobs.slice(offset, offset + jobsPerPage);

  return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
				<Modal.Title>Job Details</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				<p><strong>Company:</strong> {selectedJob?.companyName}</p>
				<p><strong>Experience Required:</strong> {selectedJob?.experience} years</p>
				<p><strong>Skills:</strong> {selectedJob?.skills}</p>
				<p><strong>Description:</strong>{selectedJob?.description}</p>
				</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={applyModal} onHide={handleApplyFormClose}>
				<Modal.Header closeButton>
				<Modal.Title>Apply for {selectedJob?.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				<Formik
					initialValues={{ firstName: '', lastName: '', email: '', skills: [], aboutMe: '' }}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({ setFieldValue, values }) => (
					<Form>
						<div>
						<label>First Name</label>
						<Field name="firstName" className="form-control" />
						<ErrorMessage name="firstName" component="div" className="text-danger" />
						</div>
						<div>
						<label>Last Name</label>
						<Field name="lastName" className="form-control" />
						<ErrorMessage name="lastName" component="div" className="text-danger" />
						</div>
						<div>
						<label>Email</label>
						<Field name="email" type="email" className="form-control" />
						<ErrorMessage name="email" component="div" className="text-danger" />
						</div>
						<div>
						<label>Skills</label>
						<Select
							isMulti
							name="skills"
							options={skillOptions}
							onChange={(selectedOptions) => setFieldValue('skills', selectedOptions)}
						/>
						<ErrorMessage name="skills" component="div" className="text-danger" />
						</div>
						<div>
						<label>About Me</label>
						<ReactQuill value={values.aboutMe} onChange={(value) => setFieldValue('aboutMe', value)} />
						<ErrorMessage name="aboutMe" component="div" className="text-danger" />
						</div>
						<Button type="submit" className="mt-3">Submit Application</Button>
					</Form>
					)}
				</Formik>
				</Modal.Body>
			</Modal>

			<div className="container">
				<h2>Job List</h2>
				<div className="mb-4">
				<FormControl
					type="text"
					placeholder="Search for jobs or companies"
					value={searchTerm}
					onChange={handleSearch}
					className="search-input"
				/>
       		 </div>
				<div className="row">
				{currentJobs.length > 0 ? currentJobs.map((job) => {
					{console.log(job.logo)}
					return(
						<div className="col-12 col-sm-12 col-md-6 col-lg-4" key={job.id}>
							<Card className='cards' onClick={() => handleShow(job)}>
								<Card.Body>
									<img
										src={job.logo} 
										alt="Company Logo" 
										onError={(e) => (e.currentTarget.src = "/path-to-default-image.png")}
										className="job-logo" 
										style={{ width: "100px", height: "100px", objectFit: "contain" }} 
									/>
								<Card.Title>{job.title ? job.title : "No Title Added"}</Card.Title>
								<Card.Subtitle className="mb-2">{job.companyName ? job.companyName : "Company Name Not added"}</Card.Subtitle>
								<div>{job.experience} years experience</div>
								<h5><Badge pill bg="warning">{job.skills}</Badge></h5>
								<div className='card-description'>{job.description}</div>
								{job.applied ? (
									<h3><Badge bg="success">Applied</Badge></h3>
								) : (
									<Button onClick={(e) => handleApply(e,job)}>Apply For Job</Button>
								)}
								</Card.Body>
							</Card>
						</div>
					)
				}
				
				)
			: "No Data"
			}
				</div>
				<div className="d-flex justify-content-end">
				<ReactPaginate 
					previousLabel={'Previous'}
					nextLabel={'Next'}
					pageCount={Math.ceil(jobs.length / jobsPerPage)}
					onPageChange={handlePageClick}
					containerClassName={'pagination'}
					activeClassName={'active'}
				/>
				</div>
			</div>
		</>
  );
};

export default JobList;
