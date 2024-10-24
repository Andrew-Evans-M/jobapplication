import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import {getAllJobs, deleteJobApi,updateJobApi,addJobApi,} from "../redux/requests/ApplicationApi";
import ReactPaginate from "react-paginate";

const AdminPanel= () => {

  const [jobs, setJobsList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const jobsPerPage = 10;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
	const response = await getAllJobs();
	const sortedJobs = response.data.sort((a: any, b: any) => 
	  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);
	setJobsList(sortedJobs);
  };

  const handleDeleteJob = async (jobId: number) => {
    await deleteJobApi(jobId);
    fetchJobs();
  };

  const handleShowModal = (job: any = null) => {
    setEditJob(job);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveJob = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement)?.value;
    const companyName = (
      form.elements.namedItem("companyName") as HTMLInputElement
    )?.value;
    const experience = (
      form.elements.namedItem("experience") as HTMLInputElement
    )?.value;
    const skills = (
      form.elements.namedItem("skills") as HTMLInputElement
    )?.value.split(","); 
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    )?.value;

    const jobData = {
      title,
      companyName,
      experience,
      skills,
      description,
    };

    if (editJob) {
      await updateJobApi(editJob?.id, jobData);
    } else {
		const response = await addJobApi(jobData);  
		setJobsList([response.data, ...jobs]);
    }
    fetchJobs(); 
    handleCloseModal(); 
  };

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * jobsPerPage;
  const currentJobs = jobs.slice(offset, offset + jobsPerPage);

  return (
		<div className="admin-panel">
			<h2>Admin Panel - Job Management</h2>
			<Button className="mb-3" onClick={() => handleShowModal()}>Add New Job</Button>
				<Table responsive bordered hover>
					<thead>
						<tr>
							<th>Job Title</th>
							<th>Company</th>
							<th>Experience</th>
							<th>Skills</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{currentJobs.map((job) => (
							<tr key={job.id}>
								<td>{job.title ? job.title : "Title Not added"}</td>
								<td>{job.companyName}</td>
								<td>{job.experience} years</td>
								<td>{job.skills}</td>
								<td>
									<Button onClick={() => handleShowModal(job)}>Edit</Button>{" "}
									<Button variant="danger" onClick={() => handleDeleteJob(job.id)}>
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>

				<Modal show={showModal} onHide={handleCloseModal}>
					<Modal.Header closeButton>
						<Modal.Title>{editJob ? "Edit Job" : "Add Job"}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={handleSaveJob}>
							<Form.Group controlId="formTitle">
							<Form.Label>Job Title</Form.Label>
								<Form.Control type="text" defaultValue={editJob?.jobtitle} name="title" required/>
							</Form.Group>
							<Form.Group controlId="formCompanyName">
							<Form.Label>Company Name</Form.Label>
								<Form.Control type="text" defaultValue={editJob?.companyName} name="companyName"required/>
							</Form.Group>
							<Form.Group controlId="formExperience">
							<Form.Label>Experience (in years)</Form.Label>
								<Form.Control type="number" defaultValue={editJob?.experience} name="experience" required/>
							</Form.Group>
							<Form.Group controlId="formSkills">
							<Form.Label>Skills (comma separated)</Form.Label>
								<Form.Control type="text" defaultValue={editJob?.skills} name="skills" required/>
							</Form.Group>
							<Form.Group controlId="formDescription">
							<Form.Label>Description</Form.Label>
								<Form.Control as="textarea" rows={3} defaultValue={editJob?.description} name="description" required />
							</Form.Group>
							<Button variant="primary" type="submit">
								Save Job
							</Button>
						</Form>
					</Modal.Body>
				</Modal>
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
  );
};

export default AdminPanel;
